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
import "../../styles/vehicleManagerStyles.css";

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
    <div className="addVehicle">
      <form onSubmit={handleSubmit}>
        <button type="submit">Add Vehicle</button>
        <input
          name="name"
          placeholder="Vehicle Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <input
          name="make"
          placeholder="Make"
          value={formState.make}
          onChange={handleChange}
        />
        <input
          name="vehicleModel"
          placeholder="Model"
          value={formState.vehicleModel}
          onChange={handleChange}
        />
      </form>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : error ? (
        <p>Error loading vehicles: {error.message}</p>
      ) : (
        <div className="vehicleGrid">
          {data.vehicles.map((v: any) => (
            <div key={v._id} className="vehicle-card">
              <strong>{v.name}</strong> ({v.make} {v.vehicleModel})<br />
              <em>Maintenance Reminders:</em>
              {v.maintenanceReminders?.length > 0 ? (
                <ul>
                  {v.maintenanceReminders.map((reminder: any, i: number) => (
                    <li key={i}>
                      {reminder.name}: {reminder.mileage.toLocaleString()} miles
                      {reminder.lastResetMileage !== undefined &&
                        ` (Last reset at ${reminder.lastResetMileage.toLocaleString()} mi)`}
                      <button
                        onClick={() =>
                          handleReminderEdit(
                            v._id,
                            reminder.name,
                            reminder.mileage
                          )
                        }
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleReminderReset(v._id, reminder.name)
                        }
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Reset
                      </button>
                      <button
                        onClick={() =>
                          handleReminderDelete(v._id, reminder.name)
                        }
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ marginLeft: "1rem", color: "#777" }}>
                  No reminders set.
                </p>
              )}
              <form
                onSubmit={(e) => handleAddReminder(e, v._id)}
                style={{ marginTop: "0.5rem" }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Reminder Name"
                  value={reminderInputs[v._id]?.name || ""}
                  onChange={(e) => handleReminderInput(v._id, e)}
                  required
                />
                <input
                  type="number"
                  name="mileage"
                  placeholder="Enter number of miles"
                  value={reminderInputs[v._id]?.mileage || ""}
                  onChange={(e) => handleReminderInput(v._id, e)}
                  required
                />
                <button type="submit">Add Reminder</button>
              </form>
              <button
                onClick={() =>
                  handleUpdate(v._id, {
                    name: prompt("Enter a new name", v.name) || v.name,
                  })
                }
                style={{
                  marginLeft: "0.5rem",
                  backgroundColor: "#337ab7",
                  color: "white",
                  border: "none",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(v._id)}
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "#cc3333",
                  color: "white",
                  border: "none",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleManager;
