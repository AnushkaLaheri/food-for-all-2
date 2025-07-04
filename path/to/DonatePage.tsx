import { useState } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { Input, Textarea, Checkbox } from "components/ui"
import { categories } from "data/categories"

const step1Schema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  category: z.enum(categories),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  preparedDate: z.date().optional(),
  expiryDays: z.number().min(0, "Expiry days cannot be negative"),
  expiryHours: z.number().min(0, "Expiry hours cannot be negative"),
  containsAllergens: z.boolean(),
})

export function DonationFormStep1({ onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(step1Schema),
  })

  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState<number>(0)
  const [expiryDays, setExpiryDays] = useState<number>(0)
  const [expiryHours, setExpiryHours] = useState<number>(0)
  const [containsAllergens, setContainsAllergens] = useState(false)

  const onSubmit = (data) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="food-name"
        name="food-name"
        placeholder="e.g., Homemade Lasagna"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        required
        className={errors.foodName ? "border-red-500" : ""}
      />

      <Textarea
        id="description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        // ...other props...
      />

      <Input
        id="quantity"
        name="quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        // ...other props...
      />

      <Input
        id="expiry-days"
        name="expiry-days"
        type="number"
        value={expiryDays}
        onChange={(e) => setExpiryDays(Number(e.target.value))}
        // ...other props...
      />

      <Input
        id="expiry-hours"
        name="expiry-hours"
        type="number"
        value={expiryHours}
        onChange={(e) => setExpiryHours(Number(e.target.value))}
        // ...other props...
      />

      <Checkbox
        id="contains-allergens"
        name="contains-allergens"
        checked={containsAllergens}
        onCheckedChange={(checked) => setContainsAllergens(Boolean(checked))}
      />

      <button type="submit">Next</button>
    </form>
  )
}

// In validateStep (step 1 section):
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

// In form submission (donationData object):
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

  pickupAddress: formData.get("pickup-address")?.toString() || "",
  pickupFrom: formData.get("pickup-from")?.toString() || "",
  pickupTo: formData.get("pickup-to")?.toString() || "",
  pickupDays: selectedPickupDays,
  contactPreference,
  notes: formData.get("notes")?.toString() || "",
  photos: photoUrls,
}