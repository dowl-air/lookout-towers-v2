export const showModalWithoutFocus = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    dialog.inert = true;
    dialog.showModal();
    dialog.inert = false;
};
