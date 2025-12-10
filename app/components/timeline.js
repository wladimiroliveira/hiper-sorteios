import { Button } from "@/components/ui/button";

export function TimelineContainer({ dates }) {
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {dates.map((date) => {
        return <TimelineCard key={date} date={date} currentDate={currentDate} />;
      })}
    </div>
  );
}

export function TimelineCard({ date, currentDate }) {
  const todayObj = new Date();

  const cardDate = parseBrazilianDate(date, todayObj);
  const todayDate = parseBrazilianDate(currentDate, todayObj);

  const isDisabled = cardDate < todayDate;

  return (
    <Button disabled={isDisabled} className="bg-primaria hover:bg-hover-primaria">
      {date}
    </Button>
  );
}

function parseBrazilianDate(dateStr, currentDateObj) {
  const [day, month] = dateStr.split("/");
  const currentYear = currentDateObj.getFullYear();
  const currentMonth = currentDateObj.getMonth() + 1;
  const year = Number(month) < currentMonth ? currentYear + 1 : currentYear;

  return new Date(`${year}-${month}-${day}`);
}
