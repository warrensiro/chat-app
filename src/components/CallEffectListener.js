import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearIncomingCall, setActiveCall } from "../redux/Slices/app";

const CallEffectListener = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { incoming, accepted } = useSelector(
    (state) => state.app.call
  );

  // 🔥 When receiver accepts
  useEffect(() => {
    if (incoming && accepted) {
      dispatch(setActiveCall(incoming));
      dispatch(clearIncomingCall());
      navigate(`/call-room/${incoming.roomID}`);
    }
  }, [incoming, accepted, dispatch, navigate]);

  return null;
};

export default CallEffectListener;