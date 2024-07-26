import { Calendar, MapPin, X } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

interface UpdateTripModalProps {
  closeUpdateTripModal: () => void;
}

export function UpdateTripModal({
  closeUpdateTripModal,
}: UpdateTripModalProps) {
  const { tripId } = useParams();
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false);
  }

  async function updateTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const destination = data.get("destination")?.toString();
    if (!eventStartAndEndDates) {
      return;
    }
    const starts_at = eventStartAndEndDates.from;
    const ends_at = eventStartAndEndDates.to;

    await api.put(`/trips/${tripId}`, {
      destination,
      starts_at,
      ends_at,
    });

    window.document.location.reload();
  }

  const displayedDate =
    eventStartAndEndDates &&
    eventStartAndEndDates.from &&
    eventStartAndEndDates.to
      ? format(eventStartAndEndDates.from, "d' de 'LLL")
          .concat(" até ")
          .concat(format(eventStartAndEndDates.to, "d' de 'LLL"))
      : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-lg font-semibold">
              Atualizar informações da viagem
            </h2>
            <button>
              <X
                className="size-5 text-zinc-400"
                onClick={closeUpdateTripModal}
              />
            </button>
          </div>
        </div>

        <form onSubmit={updateTrip} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <MapPin className="text-zinc-400 size-5" />
            <input
              name="destination"
              placeholder="Qual o local da viagem?"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            />
          </div>

          <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Calendar className="text-zinc-400 size-5" />
            <button
              onClick={openDatePicker}
              className="flex items-center gap-2 text-left w-[240px]"
            >
              <span className="text-lg text-zinc-400 w-40 flex-1">
                {displayedDate || "Quando"}
              </span>
            </button>

            {isDatePickerOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="font-lg font-semibold">
                        Selecione a data
                      </h2>
                      <button>
                        <X
                          className="size-5 text-zinc-400"
                          onClick={closeDatePicker}
                        />
                      </button>
                    </div>
                  </div>

                  <DayPicker
                    mode="range"
                    selected={eventStartAndEndDates}
                    onSelect={setEventStartAndEndDates}
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" size="full">
            Atualizar viagem
          </Button>
        </form>
      </div>
    </div>
  );
}
