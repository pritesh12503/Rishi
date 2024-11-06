import { useEffect } from "react";
import ApiErrorModal from "../../components/modal/ApiErrorModal";
import {
  useGetCallQuery,
  usePatchCallMutation,
} from "../../services/callSlice";
import Button from "../../components/form/Button";
import { useNavigate } from "react-router";
import soundFile from '../../assets/audio/sound.wav'

const CallIncomingModal = ({ id }) => {
  const navigate = useNavigate();

  const name = "CallIncomingModal";
  const btnId = name + "Button";

  const response = useGetCallQuery(id);
  const [patchCallStatus, patchCallStatusRes] = usePatchCallMutation();

  const handleActiveCall = async () => {
    await patchCallStatus({ id, status: "Active" });
    await response.refetch();
    if (response.data.type === "AudioCall") {
      navigate(`/Call/${id}/active/audio`);
    } else {
      navigate(`/Call/${id}/active/video`);
    }
  };


  const playSound = () => {
    try {
      let sound = new Audio(soundFile);
      sound.play();
    }
    catch (error) { console.log(error) }
  }



  useEffect(() => {
    if (response.isSuccess) document.getElementById(btnId).click();
  }, [response.isSuccess]);


  useEffect(() => {
    if (response.isSuccess) {
      document.getElementById(btnId).click()
      playSound()
    }
  }, [response.isSuccess])


  if (response.isLoading) return <></>
  if (response.isError) return <ApiErrorModal res={response} />;

  const call = response.data;

  return (
    <div>
      <button
        type="button"
        className="d-none"
        id={btnId}
        data-bs-toggle="modal"
        data-bs-target={"#" + name}
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id={name}
        tabIndex="-1"
        aria-labelledby={name + "Label"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-danger" id={name + "Label"}>
                {"Incoming Call..."}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {call && <p>{call.astro.name} Have Accepted the Call from </p>}
            </div>
            <div className="modal-footer">
              <>
                <Button
                  res={patchCallStatusRes}
                  data-bs-dismiss="modal"
                  onClick={handleActiveCall}
                  color={"success"}
                >
                  Start Call
                </Button>
                <Button
                  res={patchCallStatusRes}
                  data-bs-dismiss="modal"
                  onClick={() =>
                    patchCallStatus({ id: call.id, status: "UserRejected" })
                  }
                  color={"danger"}
                >
                  Reject Call
                </Button>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallIncomingModal;