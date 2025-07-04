"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowUpRight,
  Award,
  Calendar,
  Clock,
  Gift,
  TrendingUp,
  Utensils,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type Donation = {
  _id: string
  foodName: string
  description: string
  quantity: number
  unit: string
  createdAt: string
  preparedDate?: string
  expiryDays?: number
  expiryHours?: number
  photos?: string[]
}

function isDonationExpired(donation: Donation): boolean {
  const prepared = donation.preparedDate
    ? new Date(donation.preparedDate)
    : new Date(donation.createdAt)

  const expiryTime = new Date(prepared)
  if (donation.expiryDays) expiryTime.setDate(expiryTime.getDate() + donation.expiryDays)
  if (donation.expiryHours) expiryTime.setHours(expiryTime.getHours() + donation.expiryHours)

  return new Date() > expiryTime
}

function getTimeLeft(donation: Donation): string {
  const prepared = donation.preparedDate ? new Date(donation.preparedDate) : new Date(donation.createdAt)
  const expiry = new Date(prepared)
  if (donation.expiryDays) expiry.setDate(expiry.getDate() + donation.expiryDays)
  if (donation.expiryHours) expiry.setHours(expiry.getHours() + donation.expiryHours)

  const now = new Date()
  const diff = expiry.getTime() - now.getTime()

  if (diff <= 0) return "Expired"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return `${days}d ${hours}h`
}



export default function Dashboard() {
  const [donations, setDonations] = useState<Donation[]>([])

  useEffect(() => {
    const fetchDonations = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch("http://localhost:5000/api/donations/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setDonations(data)
      } catch (err) {
        console.error("Failed to fetch donations:", err)
      }
    }

    fetchDonations()
  }, [])

  const totalDonations = donations.length
  const totalMeals = donations.reduce((sum, d) => sum + (d.quantity || 0), 0)
  const activeDonations = donations.filter(
    (d) => !isDonationExpired(d) && getTimeLeft(d) !== "Expired"
  )

  const expiredDonations = donations.filter((d) => isDonationExpired(d))

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your food sharing activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations * 36}</div>
            <p className="text-xs text-muted-foreground">+{totalDonations * 5} points this week</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Meals Shared</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeals}</div>
            <p className="text-xs text-muted-foreground">Approximately {totalMeals} meals provided</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Badge</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations >= 20 ? "Gold" : "Silver"}</div>
            <div className="mt-2">
              <Progress value={(totalDonations / 25) * 100} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(25 - totalDonations) > 0 ? `${25 - totalDonations} more donations needed` : "You've earned it!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Donations</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Donations</TabsTrigger>
            </TabsList>

            {/* Active Donations */}
            <TabsContent value="active" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Your Active Donations</CardTitle>
                  <CardDescription>Food items you've listed that are currently available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeDonations.length === 0 ? (
  <p className="text-muted-foreground text-sm">No active donations right now.</p>
) : (
  activeDonations.map((donation) => (
    <div key={donation._id} className="flex items-start space-x-4 rounded-lg border p-3">
      {/* render donation details here */}
      <div className="relative h-16 w-16 overflow-hidden rounded bg-muted">
        <Image
          src={donation.photos?.[0] || "/placeholder.svg"}
          alt={donation.foodName}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{donation.foodName}</h4>
          <Badge variant="outline" className="text-xs">
            Active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{donation.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>Expires in {getTimeLeft(donation)}</span>

        </div>
      </div>
    </div>
  ))
)}

                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/donate">Add New Donation</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Upcoming Donations */}
            <TabsContent value="upcoming" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Donations</CardTitle>
                  <CardDescription>Donations you've scheduled for the future</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>No upcoming donations scheduled</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/donate">Schedule a Donation</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Past Donations */}
            <TabsContent value="past" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past Donations</CardTitle>
                  <CardDescription>Your donation history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expiredDonations.length === 0 ? (
  <p className="text-muted-foreground text-sm">No past donations found.</p>
) : (
  expiredDonations.map((donation) => (
    <div key={donation._id} className="flex items-start space-x-4 rounded-lg border p-3">
      <div className="relative h-16 w-16 overflow-hidden rounded bg-muted">
        <Image
          src={donation.photos?.[0] || "/placeholder.svg"}
          alt={donation.foodName}
          fill
          className="object-cover opacity-70"
        />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold">{donation.foodName}</h4>
        <p className="text-sm text-muted-foreground">{donation.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
        <span>
          {getTimeLeft(donation) === "Expired" ? "Expired" : "Used by recipient"}
        </span>
        </div>
      </div>
    </div>
  ))
)}

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Section */}
        <div className="col-span-3 space-y-4">
          <Card className="animate-fade-in-up animation-delay-200">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>See the difference you're making</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Food Waste Reduced</span>
                  <span className="text-sm font-medium">{totalMeals} kg</span>
                </div>
                <Progress value={Math.min(totalMeals, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  You've helped reduce food waste by {totalMeals} kg this year
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">People Helped</span>
                  <span className="text-sm font-medium">{totalMeals}</span>
                </div>
                <Progress value={Math.min(totalMeals, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Your donations have helped approximately {totalMeals} people
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CO₂ Emissions Saved</span>
                  <span className="text-sm font-medium">{totalMeals * 0.5} kg</span>
                </div>
                <Progress value={Math.min(totalMeals * 0.5, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  By reducing food waste, you've prevented {totalMeals * 0.5} kg of CO₂ emissions
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/impact">
                  View Detailed Impact <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardHeader>
              <CardTitle>Nearby Food Available</CardTitle>
              <CardDescription>Food donations in your area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start space-x-4 rounded-lg border p-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded">
                    <Image
                      src={`/placeholder.svg?height=64&width=64&text=Nearby+${i}`}
                      alt={`Nearby food ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">Fresh Bread & Pastries</h4>
                    <p className="text-sm text-muted-foreground">Assorted bread and pastries from local bakery</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>1.2 miles away • Available now</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/explore">View All Nearby Food</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
