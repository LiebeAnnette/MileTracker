import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VEHICLES, ADD_VEHICLE } from "../graphql/vehicleQueries";

const VehicleManager: React.FC = () => {
  const { data, loading, error } = useQuery(GET_VEHICLES);
  const [addVehicle] = useMutation(ADD_VEHICLE, {
    refetchQueries: [{ query: GET_VEHICLES }],
  });

  const [formState, setFormState] = useState({
    name: "",
    make: "",
    vehicleModel: "",
    maintenanceReminderMiles: 5000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "maintenanceReminderMiles" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({ variables: formState });
      setFormState({
        name: "",
        make: "",
        vehicleModel: "",
        maintenanceReminderMiles: 5000,
      });
    } catch (err) {
      console.error("Failed to add vehicle:", err);
    }
  };

  return (
    <div>
      <h2>Your Vehicles</h2>

      <form onSubmit={handleSubmit}>
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
        <input
          name="maintenanceReminderMiles"
          type="number"
          placeholder="Reminder Miles"
          value={formState.maintenanceReminderMiles}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Vehicle</button>
      </form>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : error ? (
        <p>Error loading vehicles: {error.message}</p>
      ) : (
        <ul>
          {data.vehicles.map((v: any) => (
            <li key={v._id}>
              🚗 {v.name} ({v.make} {v.vehicleModel}) — Reminder:{" "}
              {v.maintenanceReminderMiles} miles
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VehicleManager;
