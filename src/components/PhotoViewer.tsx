import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface Props {
  icon?: JSX.Element;
  image?: JSX.Element;
}

export default function PhotoViewer(props: Props) {
  let [isOpen, setIsOpen] = useState(false);

  return isOpen ? (
    <Dialog
      open={isOpen}
      as="div"
      className="z-100 relative "
      onClose={() => setIsOpen(false)}
    >
      <Dialog.Panel
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 flex h-screen w-screen transform items-center justify-center overflow-hidden overflow-y-auto bg-stone-300 bg-transparent align-middle dark:bg-stone-700 "
      >
        {props.image}
      </Dialog.Panel>
    </Dialog>
  ) : (
    <button
      className="transition-ring transition-color group rounded-xl bg-stone-200/50 p-2 opacity-0 ring-inset ring-stone-500/50 transition-opacity hover:bg-stone-200 hover:bg-stone-500/10 hover:ring-1 group-hover:opacity-80 dark:bg-stone-800/50 dark:hover:bg-stone-800"
      onClick={() => setIsOpen(true)}
    >
      <div className="text-md justify-left flex h-full flex-row items-center gap-2 font-bold">
        {props.icon}
      </div>
    </button>
  );
}
