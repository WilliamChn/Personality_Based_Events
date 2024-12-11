import React from "react";
import { useParams } from "react-router-dom";

const SelectedProfilePage = () => {
  const { name } = useParams(); // Retrieve the selected profile's name from the URL

  return (
    <div className="selected-profile-page">
      <h1>Profile Details</h1>
      <p>You selected: <strong>{name}</strong></p>
    </div>
  );
};

export default SelectedProfilePage;
