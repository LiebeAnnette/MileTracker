import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_VEHICLES,
  ADD_VEHICLE,
  DELETE_VEHICLE,
  UPDATE_VEHICLE,
  UPDATE_MAINTENANCE_REMINDER,
  RESET_MAINTENANCE_REMINDER,
  DELETE_MAINTENANCE_REMINDER,
  ADD_MAINTENANCE_REMINDER,
} from "../graphql/vehicleQueries";
import { GET_ALERT_MESSAGES } from "../graphql/maintenanceQueries";
import Card from "./Card";
import Button from "./Button";
import { baseFieldStyles } from "../../styles/styles";

const VehicleManager: React.FC = () => {
  const { data, loading, error } = useQuery(GET_VEHICLES);

  const sharedRefetch = [
    { query: GET_VEHICLES },
    { query: GET_ALERT_MESSAGES },
  ];

  const [addVehicle] = useMutation(ADD_VEHICLE, {
    refetchQueries: sharedRefetch,
  });
  const [deleteVehicle] = useMutation(DELETE_VEHICLE, {
    refetchQueries: sharedRefetch,
  });
  const [updateVehicle] = useMutation(UPDATE_VEHICLE, {
    refetchQueries: sharedRefetch,
  });
  const [addReminder] = useMutation(ADD_MAINTENANCE_REMINDER, {
    refetchQueries: sharedRefetch,
  });
  const [updateReminder] = useMutation(UPDATE_MAINTENANCE_REMINDER, {
    refetchQueries: sharedRefetch,
  });
  const [resetReminder] = useMutation(RESET_MAINTENANCE_REMINDER, {
    refetchQueries: sharedRefetch,
  });
  const [deleteReminder] = useMutation(DELETE_MAINTENANCE_REMINDER, {
    refetchQueries: sharedRefetch,
  });

  const [formState, setFormState] = useState({
    name: "",
    make: "",
    vehicleModel: "",
  });

  const [reminderInputs, setReminderInputs] = useState<
    Record<string, { name: string; mileage: string }>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReminderInput = (
    vehicleId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setReminderInputs((prev) => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [name]: value,
      },
    }));
  };

  const handleAddReminder = async (e: React.FormEvent, vehicleId: string) => {
    e.preventDefault();
    const reminder = reminderInputs[vehicleId];
    const parsedMileage = parseFloat(reminder?.mileage);
    if (!reminder || !reminder.name || isNaN(parsedMileage)) return;
    try {
      await addReminder({
        variables: {
          vehicleId,
          name: reminder.name,
          mileage: parsedMileage,
        },
      });
      setReminderInputs((prev) => ({
        ...prev,
        [vehicleId]: { name: "", mileage: "" },
      }));
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({ variables: formState });
      setFormState({
        name: "",
        make: "",
        vehicleModel: "",
      });
    } catch (err) {
      console.error("Failed to add vehicle:", err);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await deleteVehicle({ variables: { _id } });
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
    }
  };

  const handleUpdate = async (
    _id: string,
    updatedFields: { name?: string; maintenanceReminderMiles?: number }
  ) => {
    try {
      await updateVehicle({ variables: { _id, ...updatedFields } });
    } catch (err) {
      console.error("Failed to update vehicle:", err);
    }
  };

  const handleReminderEdit = async (
    vehicleId: string,
    name: string,
    mileage: number
  ) => {
    const newMileage = parseFloat(
      prompt(`Update mileage for ${name}:`, mileage.toString()) ||
        mileage.toString()
    );
    if (!isNaN(newMileage)) {
      await updateReminder({
        variables: { vehicleId, name, mileage: newMileage },
      });
    }
  };

  const handleReminderReset = async (vehicleId: string, name: string) => {
    await resetReminder({ variables: { vehicleId, name } });
  };

  const handleReminderDelete = async (vehicleId: string, name: string) => {
    await deleteReminder({ variables: { vehicleId, name } });
  };

  return (
    <Card
      title={
        <div className="heading-xl text-center text-black">Vehicle Manager</div>
      }
    >
      <div className="flex flex-col items-center space-y-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl flex flex-col items-center bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6"
        >
          <div className="heading-xl text-center text-prussian">
            Add Vehicle
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <input
              name="name"
              placeholder="Vehicle Name"
              value={formState.name}
              onChange={handleChange}
              required
              className={baseFieldStyles}
            />
            <input
              name="make"
              placeholder="Make"
              value={formState.make}
              onChange={handleChange}
              className={baseFieldStyles}
            />
            <input
              name="vehicleModel"
              placeholder="Model"
              value={formState.vehicleModel}
              onChange={handleChange}
              className={baseFieldStyles}
            />
          </div>

          <Button type="submit" className="self-center">
            Add Vehicle
          </Button>
        </form>

        {loading ? (
          <p>Loading vehicles...</p>
        ) : error ? (
          <p>Error loading vehicles: {error.message}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            {data.vehicles.map((v: any) => (
              <div
                key={v._id}
                className="bg-[color:var(--sky)] bg-opacity-10 border border-[color:var(--sky)] rounded-2xl shadow-lg p-6 space-y-4 transition hover:shadow-xl"
              >
                <div className="text-2xl font-extrabold text-[color:var(--prussian)] tracking-wide">
                  {v.name}
                  <span className="block text-sm font-medium text-gray-600 italic">
                    {v.make} {v.vehicleModel}
                  </span>
                </div>

                <div>
                  <div className="inline-block bg-[color:var(--pink)] text-black text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    Maintenance Reminders:
                  </div>
                  {v.maintenanceReminders?.length > 0 ? (
                    <ul className="space-y-1">
                      {v.maintenanceReminders.map(
                        (reminder: any, i: number) => (
                          <li key={i} className="text-sm text-gray-800">
                            <span className="font-medium">{reminder.name}</span>
                            : {reminder.mileage.toLocaleString()} miles
                            {reminder.lastResetMileage !== undefined &&
                              ` (Last reset at ${reminder.lastResetMileage.toLocaleString()} mi)`}
                            <div className="inline-flex gap-2 ml-2">
                              <Button
                                onClick={() =>
                                  handleReminderEdit(
                                    v._id,
                                    reminder.name,
                                    reminder.mileage
                                  )
                                }
                                className="text-xs px-2 py-1"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() =>
                                  handleReminderReset(v._id, reminder.name)
                                }
                                className="text-xs px-2 py-1"
                              >
                                Reset
                              </Button>
                              <Button
                                onClick={() =>
                                  handleReminderDelete(v._id, reminder.name)
                                }
                                className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="ml-2 text-sm text-gray-500">
                      No reminders set.
                    </p>
                  )}
                </div>

                <form
                  onSubmit={(e) => handleAddReminder(e, v._id)}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Reminder Name"
                    value={reminderInputs[v._id]?.name || ""}
                    onChange={(e) => handleReminderInput(v._id, e)}
                    required
                    className={`${baseFieldStyles} w-40`}
                  />
                  <input
                    type="number"
                    name="mileage"
                    placeholder="Enter miles"
                    value={reminderInputs[v._id]?.mileage || ""}
                    onChange={(e) => handleReminderInput(v._id, e)}
                    required
                    className={`${baseFieldStyles} w-48`}
                  />
                  <Button type="submit" className="text-sm">
                    Add Reminder
                  </Button>
                </form>

                <div className="flex gap-2 pt-2 border-t border-gray-300 mt-4">
                  <Button
                    onClick={() =>
                      handleUpdate(v._id, {
                        name: prompt("Enter a new name", v.name) || v.name,
                      })
                    }
                  >
                    Rename
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDelete(v._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VehicleManager;
