import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"

export function UserProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [learningGoals, setLearningGoals] = useState({
    daily: { time: 60, unit: "minutes" },
    monthly: { articles: 10 }
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username, learning_goals')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      if (data) {
        setUsername(data.username || '')
        setLearningGoals(data.learning_goals)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          username,
          learning_goals: learningGoals
        })
        .eq('id', user?.id)

      if (error) throw error
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">הגדרות פרופיל</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">שם משתמש</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="הכנס שם משתמש"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">יעד למידה יומי (דקות)</label>
          <Input
            type="number"
            value={learningGoals.daily.time}
            onChange={(e) => setLearningGoals(prev => ({
              ...prev,
              daily: { ...prev.daily, time: parseInt(e.target.value) }
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">יעד מאמרים חודשי</label>
          <Input
            type="number"
            value={learningGoals.monthly.articles}
            onChange={(e) => setLearningGoals(prev => ({
              ...prev,
              monthly: { ...prev.monthly, articles: parseInt(e.target.value) }
            }))}
          />
        </div>
        <Button onClick={updateProfile}>שמור שינויים</Button>
      </div>
    </Card>
  )
}