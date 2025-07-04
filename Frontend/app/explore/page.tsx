"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Clock, Filter, MapPin, Search } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function ExplorePage() {
  const [distance, setDistance] = useState([5])

  const [foodItems, setFoodItems] = useState<any[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchDonations = async () => {
    try {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations`);
     const data = await res.json();
     console.log("API response:", data);


      // Ensure the response is an array
      if (Array.isArray(data)) {
        setFoodItems(data)
      } else {
        console.error("Unexpected response format:", data)
        setFoodItems([])
      }
    } catch (err) {
      console.error("Error fetching donations:", err)
      setFoodItems([])
    } finally {
      setLoading(false)
    }
  }

  fetchDonations()
}, [])



  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Available Food</h1>
        <p className="text-muted-foreground">Browse food donations in your area</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 shrink-0 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="space-y-2">
                  {["Cooked Meal", "Bakery", "Produce", "Canned Goods", "Dairy", "Other"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`category-${category.toLowerCase().replace(" ", "-")}`} />
                      <Label htmlFor={`category-${category.toLowerCase().replace(" ", "-")}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Distance</h3>
                  <span className="text-sm text-muted-foreground">{distance[0]} miles</span>
                </div>
                <Slider defaultValue={[5]} max={20} step={1} value={distance} onValueChange={setDistance} />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Dietary Preferences</h3>
                <div className="space-y-2">
                  {["Vegetarian", "Vegan", "Gluten-Free", "Nut-Free", "Dairy-Free"].map((pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox id={`pref-${pref.toLowerCase().replace(" ", "-")}`} />
                      <Label htmlFor={`pref-${pref.toLowerCase().replace(" ", "-")}`} className="text-sm">
                        {pref}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sort By</h3>
                <Select defaultValue="distance">
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="expiry">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden mb-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search food items..." className="pl-8" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down your food search</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Categories</h3>
                    <div className="space-y-2">
                      {["Cooked Meal", "Bakery", "Produce", "Canned Goods", "Dairy", "Other"].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox id={`mobile-category-${category.toLowerCase().replace(" ", "-")}`} />
                          <Label
                            htmlFor={`mobile-category-${category.toLowerCase().replace(" ", "-")}`}
                            className="text-sm"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Distance</h3>
                      <span className="text-sm text-muted-foreground">{distance[0]} miles</span>
                    </div>
                    <Slider defaultValue={[5]} max={20} step={1} value={distance} onValueChange={setDistance} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Sort By</h3>
                    <Select defaultValue="distance">
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="expiry">Expiring Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <p className="text-sm text-muted-foreground">
                Showing {foodItems.length} items within {distance[0]} miles
              </p>
            </div>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden animate-fade-in-up">
                    <div className="aspect-video relative">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
                        {item.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {item.distance} mi
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Listed {item.time}</span>
                        <span className="mx-2">•</span>
                        <span>Expires in {item.expires}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full">
                        Request Item
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {foodItems.map((item, index) => (
                <Card key={item.id || index} className="overflow-hidden animate-fade-in-up">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name || "Food donation image"}
                        fill
                        className="object-cover"
                      />

                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {item.category}
                          </Badge>
                        </div>
                        <Badge variant="outline">{item.distance} mi</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Listed {item.time}</span>
                        <span className="mx-2">•</span>
                        <span>Expires in {item.expires}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Pickup available</span>
                        </div>
                        <Button size="sm">Request Item</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

