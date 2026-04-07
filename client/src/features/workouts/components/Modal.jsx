import { useEffect, useRef } from "react";
import ModalContent from "./ModalContent";

export default function Modal({ openModal, closeModal, content }) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
      // showModal is a js DOM method for dialog boxes
      // ref.current? refers to the element with the reference named ref
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} onCancel={closeModal} className={"translate-x-100 translate-y-"}>
      <ModalContent cancel={closeModal} />
    </dialog>
  );
}
