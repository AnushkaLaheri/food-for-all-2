"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Check, ChevronRight, Clock, Info, MapPin, Upload, CalendarIcon } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"



// Define validation schema for each step
const step1Schema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  preparedDate: z.date().optional(),
  expiryDays: z.number().min(0, "Days cannot be negative"),
  expiryHours: z.number().min(0, "Hours cannot be negative").max(23, "Hours must be less than 24"),
  containsAllergens: z.boolean(),
})

const step2Schema = z.object({
  pickupAddress: z.string().min(1, "Pickup address is required"),
  pickupFrom: z.string().min(1, "Pickup start time is required"),
  pickupTo: z.string().min(1, "Pickup end time is required"),
  pickupDays: z.array(z.string()).min(1, "Select at least one pickup day"),
  contactPreference: z.string().min(1, "Contact preference is required"),
  notes: z.string().optional(),
})

const step3Schema = z.object({
  photos: z.array(z.instanceof(File)).optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must confirm the food is safe" }),
  }),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "You must agree to share contact details" }),
  }),
})

export default function DonatePage() {
  const { toast } = useToast()
 // Step management
  const [step, setStep] = useState(1)

  // Step 1 states
  const [foodName, setFoodName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState("servings")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [expiryDays, setExpiryDays] = useState(0)
  const [expiryHours, setExpiryHours] = useState(0)
  const [containsAllergens, setContainsAllergens] = useState(false)

  // Step 2 states
  const [pickupAddress, setPickupAddress] = useState("")
  const [pickupFrom, setPickupFrom] = useState("")
  const [pickupTo, setPickupTo] = useState("")
  const [pickupDays, setPickupDays] = useState<string[]>([])
  const [contactPreference, setContactPreference] = useState("app")
  const [notes, setNotes] = useState("")

  // Step 3 states
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const [termsChecked, setTermsChecked] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle day selection
  const handleDayToggle = (day: string) => {
    setPickupDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }
  
  // Handle photo uploads
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const fileArray = Array.from(e.target.files)
    const updatedPhotos = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setPhotos(updatedPhotos)
  }
}

  
    // Validate current step
  const validateStep = (stepNumber: number) => {
    try {
      if (stepNumber === 1) {
        step1Schema.parse({
          foodName,
          category,
          description,
          quantity,
          unit,
          preparedDate: date,
          expiryDays,
          expiryHours,
          containsAllergens,
        })
      } else if (stepNumber === 2) {
        step2Schema.parse({
          pickupAddress,
          pickupFrom,
          pickupTo,
          pickupDays,
          contactPreference,
          notes,
        })
      } else if (stepNumber === 3) {
        step3Schema.parse({
          photos: photos.map((p) => p.file), // ✅ extract only File objects
          terms: termsChecked,
          privacy: privacyChecked,
        })
      }
      setErrors({})
      return true
    } catch (error) {
      console.error("❌ Zod validation error:", error)
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  
  // Handle next step
   const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("🚀 handleSubmit triggered");

    // Get token from localStorage
    let token = ""
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || ""
    }
    
    if (!token) {
      return toast({ 
        title: "Authentication Error", 
        description: "Please login to donate.",
        variant: "destructive"
      })
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Validate final step
    const isValid = validateStep(step)
    console.log("✅ Validation Passed:", isValid);
    if (!isValid) return


    // Get selected pickup days
    const selectedPickupDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].filter((day) => {
      return formData.get(`day-${day.toLowerCase()}`) === "on"
    })

    try {
      // Upload photos first if any
      let photoUrls: string[] = []
      console.log("📸 Uploading photos...");
      if (photos.length > 0) {
        const photoFormData = new FormData()
        photos.forEach(({ file }) => {
        photoFormData.append("photos", file)
      })

        
        const photoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads`, {          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: photoFormData,
          credentials: "include"
        })
        
        if (!photoRes.ok) {
          throw new Error("Failed to upload photos")
        }
        
        const photoData = await photoRes.json()
        photoUrls = photoData.urls || []
      }
      
      // Prepare donation data
      const donationData = {
        foodName,
        category,
        description,
        quantity,
        unit,
        preparedDate: date ? date.toISOString() : null,
        expiryDays,
        expiryHours,
        containsAllergens,

        pickupAddress,
        pickupFrom,
        pickupTo,
        pickupDays,
        contactPreference,
        notes,

        photos: photoUrls,
      }


      console.log("Submitting donation:", donationData);
      console.log("🌍 API endpoint:", `${process.env.NEXT_PUBLIC_API_URL}/api/donations`);


      // Submit donation data
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(donationData),
      credentials: "include",
    });


      const resData = await res.json()
      console.log("📨 Server response:", res.status);
console.log("📨 Response JSON:", resData);

      if (res.ok) {
        toast({
  title: "🎉 Donation submitted!",
  description: "Thank you for your generosity.",
  action: (
    <Button variant="ghost" size="sm" onClick={() => console.log("Toast action clicked")}>
      Got it!
    </Button>
  ),
  duration: 5000,
})

        confetti({
  particleCount: 150,
  spread: 70,
  origin: { y: 0.6 },
})

        // Reset form
        setStep(1)
        setFoodName("")
        setCategory("")
        setDescription("")
        setQuantity(1)
        setUnit("servings")
        setDate(undefined)
        setExpiryDays(0)
        setExpiryHours(0)
        setContainsAllergens(false)

        setPickupAddress("")
        setPickupFrom("")
        setPickupTo("")
        setPickupDays([])
        setContactPreference("app")
        setNotes("")

        setPhotos([])
        setTermsChecked(false)
        setPrivacyChecked(false)
      } else {
        toast({
          title: "❌ Error",
          description: resData.message || "Failed to submit donation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Donation error:", error)
      toast({
        title: "Server Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6 animate-fade-in">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Donate Food</h1>
        <p className="text-muted-foreground">
          Share your surplus food with those who need it most
        </p>
      </div>

      <Tabs defaultValue="one-time" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="one-time">One-time Donation</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Donation</TabsTrigger>
        </TabsList>

        <TabsContent value="one-time">
          <Card>
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
              <CardDescription>
                Provide information about the food you're donating
              </CardDescription>

              {/* Progress indicator */}
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      step >= 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    1
                  </div>
                  <div
                    className={`h-1 w-12 ${
                      step > 1 ? "bg-primary" : "bg-muted"
                    }`}
                  ></div>
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      step >= 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    2
                  </div>
                  <div
                    className={`h-1 w-12 ${
                      step > 2 ? "bg-primary" : "bg-muted"
                    }`}
                  ></div>
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      step >= 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    3
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={step < 3 ? handleNextStep : handleSubmit}
                className="space-y-8"
              >
                {/* Step 1 */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="food-name">Food Name</Label>
                      <Input
                        id="food-name"
                        name="food-name"
                        placeholder="e.g. Rice and curry"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                      />
                      {errors.foodName && (
                        <p className="text-sm text-red-500">{errors.foodName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={category}
                        onValueChange={setCategory}
                        name="category"
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cooked">Cooked</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="packed">Packed</SelectItem>
                          <SelectItem value="bakery">Bakery</SelectItem>
                          <SelectItem value="produced">Produced</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Short description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Number(e.target.value) || 0)
                        }
                      />
                      {errors.quantity && (
                        <p className="text-sm text-red-500">{errors.quantity}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={unit} onValueChange={setUnit} name="unit">
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="servings">Servings</SelectItem>
                          <SelectItem value="kgs">Kilograms</SelectItem>
                          <SelectItem value="litres">Litres</SelectItem>
                          <SelectItem value="packs">Packs</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.unit && (
                        <p className="text-sm text-red-500">{errors.unit}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="prepared-date">Prepared Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date
                              ? format(date, "PPP")
                              : "Select prepared date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) =>
                              date > new Date() || date < new Date(2023, 0, 1)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="expiry-days">Expiry (Days)</Label>
                      <Input
                        id="expiry-days"
                        name="expiry-days"
                        type="number"
                        min={0}
                        value={expiryDays}
                        onChange={(e) =>
                          setExpiryDays(Number(e.target.value) || 0)
                        }
                      />
                      {errors.expiryDays && (
                        <p className="text-sm text-red-500">{errors.expiryDays}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="expiry-hours">Expiry (Hours)</Label>
                      <Input
                        id="expiry-hours"
                        name="expiry-hours"
                        type="number"
                        min={0}
                        max={23}
                        value={expiryHours}
                        onChange={(e) =>
                          setExpiryHours(Number(e.target.value) || 0)
                        }
                      />
                      {errors.expiryHours && (
                        <p className="text-sm text-red-500">{errors.expiryHours}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="contains-allergens"
                        checked={containsAllergens}
                        onCheckedChange={(checked) =>
                          setContainsAllergens(!!checked)
                        }
                      />
                      <Label htmlFor="contains-allergens">
                        Contains Allergens
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickup-address">Pickup Address</Label>
                      <Input
                        id="pickup-address"
                        name="pickup-address"
                        placeholder="Enter pickup address"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                      />
                      {errors.pickupAddress && (
                        <p className="text-sm text-red-500">{errors.pickupAddress}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pickup-from">Pickup From</Label>
                      <Input
                        id="pickup-from"
                        name="pickup-from"
                        type="time"
                        value={pickupFrom}
                        onChange={(e) => setPickupFrom(e.target.value)}
                      />
                      {errors.pickupFrom && (
                        <p className="text-sm text-red-500">{errors.pickupFrom}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pickup-to">Pickup To</Label>
                      <Input
                        id="pickup-to"
                        name="pickup-to"
                        type="time"
                        value={pickupTo}
                        onChange={(e) => setPickupTo(e.target.value)}
                      />
                      {errors.pickupTo && (
                        <p className="text-sm text-red-500">{errors.pickupTo}</p>
                      )}
                    </div>

                    <div>
                      <Label>Pickup Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <Button
                            key={day}
                            variant={pickupDays.includes(day) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleDayToggle(day)}
                            type="button"
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                      {errors.pickupDays && (
                        <p className="text-sm text-red-500">{errors.pickupDays}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contact-preference">Contact Preference</Label>
                      <Select
                        value={contactPreference}
                        onValueChange={setContactPreference}
                        name="contact-preference"
                      >
                        <SelectTrigger id="contact-preference">
                          <SelectValue placeholder="Select contact preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">App Notification</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.contactPreference && (
                        <p className="text-sm text-red-500">
                          {errors.contactPreference}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Any special instructions?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      {errors.notes && (
                        <p className="text-sm text-red-500">{errors.notes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="photos">Upload Photos (optional)</Label>
                      <Input
                        id="photos"
                        name="photos"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                      />
                    </div>

                    {photos.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {photos.map((photo, idx) => (
                          <div key={idx} className="w-24 h-24 relative border rounded overflow-hidden">
                            <img
                              src={photo.preview}
                              alt={`Preview ${idx}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}


                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={termsChecked}
                        onCheckedChange={(checked) => setTermsChecked(!!checked)}
                      />
                      <Label htmlFor="terms">
                        I confirm the food is safe to consume
                      </Label>
                      {errors.terms && (
                        <p className="text-sm text-red-500">{errors.terms}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={privacyChecked}
                        onCheckedChange={(checked) => setPrivacyChecked(!!checked)}
                      />
                      <Label htmlFor="privacy">
                        I agree to share my contact details with the recipient
                      </Label>
                      {errors.privacy && (
                        <p className="text-sm text-red-500">{errors.privacy}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </Button>
                  )}
                  <Button type="submit" disabled={step === 3 && (!termsChecked || !privacyChecked)}>
                    {step === 3 ? "Submit Donation" : "Next Step"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring">
          <p className="text-center text-muted-foreground">
            Recurring donations coming soon.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}