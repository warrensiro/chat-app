import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { endCall } from "../../redux/Slices/app";

const CallRoom = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!roomID) return;

    console.log("Joining room:", roomID);

  }, [roomID]);

  const handleEndCall = () => {
    dispatch(endCall());
    navigate("/app");
  };

  return (
    <div>
      <h2>Call Room: {roomID}</h2>
      <button onClick={handleEndCall}>End Call</button>
    </div>
  );
};

export default CallRoom;