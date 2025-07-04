"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Award, Calendar, Camera, Edit, Gift, MapPin, Medal, Settings, Star, User } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    role: "Consumer",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        method: "GET",  
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // only needed for PUT
        },
        })

        const data = await res.json()
        if (res.ok) {
          setUserData(data)
        } else {
          console.error("Profile fetch failed:", data.message)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    }

    fetchProfile()
  }, [])

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(userData),


      })

      const data = await res.json()
      if (res.ok) {
        setEditMode(false)
        console.log("Profile updated successfully")
      } else {
        console.error("Update failed:", data.message)
      }
    } catch (err) {
      console.error("Error updating profile:", err)
    }
  }

  const achievements = [
    { id: 1, name: "First Donation", description: "Made your first food donation", icon: Gift, date: "Jan 15, 2023", unlocked: true },
    { id: 2, name: "Regular Donor", description: "Donated food 5 times", icon: Calendar, date: "Mar 22, 2023", unlocked: true },
    { id: 3, name: "Neighborhood Hero", description: "Donated to 10 different people", icon: MapPin, date: "May 10, 2023", unlocked: true },
    { id: 4, name: "Variety Master", description: "Donated 5 different types of food", icon: Award, date: "Jun 5, 2023", unlocked: true },
    { id: 5, name: "Silver Status", description: "Reached Silver donor status", icon: Medal, date: null, unlocked: false, progress: 72 },
    { id: 6, name: "Community Champion", description: "Helped 50+ people", icon: Star, date: null, unlocked: false, progress: 64 },
  ]

  const donationHistory = [
    { id: 1, name: "Homemade Lasagna", category: "Cooked Meal", date: "May 15, 2023", recipient: "Maria Garcia", image: "/placeholder.svg" },
    { id: 2, name: "Fresh Bread Assortment", category: "Bakery", date: "May 2, 2023", recipient: "John Smith", image: "/placeholder.svg" },
    { id: 3, name: "Vegetable Soup", category: "Cooked Meal", date: "Apr 28, 2023", recipient: "Emily Johnson", image: "/placeholder.svg" },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and track your impact</p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="relative pb-2">
              <div className="absolute right-4 top-4">
                <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                {editMode && (
                  <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-white">
                    <Camera className="h-4 w-4" />
                  </div>
                )}
                <CardTitle className="mt-4">{userData.name}</CardTitle>
                <CardDescription>
                  <Badge className="mt-1 bg-amber-700 text-white">Bronze Donor</Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <div className="space-y-4">
                  {["name", "email", "phone", "address"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        id={field}
                        value={userData[field as keyof typeof userData]}
                        onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={userData.bio}
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">About</p>
                      <p className="text-sm text-muted-foreground">{userData.bio}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{userData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">January 2023</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Settings className="h-5 w-5 mr-2" /> Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Email Notifications", "Profile Privacy", "Show on Leaderboard"].map((label, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">Toggle {label.toLowerCase()}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5 space-y-6">
          <Tabs defaultValue="achievements">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="history">Donation History</TabsTrigger>
              <TabsTrigger value="impact">Your Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Milestones you’ve earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((a) => (
                      <div key={a.id} className={cn("flex items-start space-x-4 p-4 rounded-lg border", !a.unlocked && "opacity-60")}>
                        <div className={cn("w-12 h-12 flex items-center justify-center rounded-full", a.unlocked ? "bg-emerald-200 text-emerald-700" : "bg-muted")}>
                          <a.icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">{a.name}</h4>
                            {a.unlocked && <Badge className="ml-2 bg-emerald-500 text-white text-xs">Unlocked</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{a.description}</p>
                          {a.unlocked ? (
                            <p className="text-xs text-muted-foreground">Achieved on {a.date}</p>
                          ) : (
                            <div className="space-y-1 pt-1">
                              <Progress value={a.progress} className="h-1" />
                              <p className="text-xs text-muted-foreground">{a.progress}% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Your past contributions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {donationHistory.map((donation) => (
                    <div key={donation.id} className="flex space-x-4 border rounded-lg p-4">
                      <div className="relative h-20 w-20 rounded overflow-hidden">
                        <Image src={donation.image} alt={donation.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4>{donation.name}</h4>
                          <Badge variant="outline">{donation.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Recipient: {donation.recipient}</p>
                        <p className="text-xs text-muted-foreground">{donation.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                  <CardDescription>Stats from your contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ImpactItem label="Total Donations" value="18" icon={Gift} />
                    <ImpactItem label="People Helped" value="54" icon={User} />
                    <ImpactItem label="Impact Score" value="540" icon={Award} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ImpactItem({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 p-6 bg-muted/50 rounded-lg">
      <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
