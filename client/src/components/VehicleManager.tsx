import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_VEHICLES,
  ADD_VEHICLE,
  DELETE_VEHICLE,
  UPDATE_VEHICLE,
} from "../graphql/vehicleQueries"; // You can split this if you prefer!
import "../../styles/vehicleManagerStyles.css"

const VehicleManager: React.FC = () => {
  const { data, loading, error } = useQuery(GET_VEHICLES);

  const [addVehicle] = useMutation(ADD_VEHICLE, {
    refetchQueries: [{ query: GET_VEHICLES }],
  });

  const [deleteVehicle] = useMutation(DELETE_VEHICLE, {
    refetchQueries: [{ query: GET_VEHICLES }],
  });

  const [updateVehicle] = useMutation(UPDATE_VEHICLE, {
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

  return (
    <div className="addVehicle">
      {/* <h2>Your Vehicles</h2> */}

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
        <input
          name="maintenanceReminderMiles"
          type="number"
          placeholder="Reminder Miles"
          value={formState.maintenanceReminderMiles}
          onChange={handleChange}
          required
        />
        {/* <button type="submit">Add Vehicle</button> */}
      </form>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : error ? (
        <p>Error loading vehicles: {error.message}</p>
      ) : (
        <div className = "vehicleGrid">
          {data.vehicles.map((v: any) => (
            <div key={v._id}>
              {v.name} ({v.make} {v.vehicleModel}) — Reminder:{" "}
              {v.maintenanceReminderMiles} miles{" "}
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
