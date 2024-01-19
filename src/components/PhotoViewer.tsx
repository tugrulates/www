import { Dialog } from "@headlessui/react";
import { useState } from "react";

interface Props {
  button?: JSX.Element;
  image?: JSX.Element;
}

export default function PhotoViewer(props: Props) {
  let [isOpen, setIsOpen] = useState(false);

  return isOpen ? (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50"
      onClose={() => setIsOpen(false)}
    >
      <Dialog.Panel
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 flex h-screen w-screen transform items-center justify-center overflow-hidden overflow-y-auto bg-stone-300 align-middle dark:bg-stone-700 "
      >
        <div className="h-fit w-fit bg-stone-200/20">{props.image}</div>
      </Dialog.Panel>
    </Dialog>
  ) : (
    <button onClick={() => setIsOpen(true)}>{props.button}</button>
  );
}
