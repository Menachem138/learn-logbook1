import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 - 21:00

const CourseSchedule = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>לוח זמנים</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">שעה</th>
                {days.map(day => (
                  <th key={day} className="border p-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour}>
                  <td className="border p-2">{`${hour}:00`}</td>
                  {days.map(day => (
                    <td key={`${day}-${hour}`} className="border p-2"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSchedule;