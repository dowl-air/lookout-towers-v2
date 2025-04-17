export const showModalWithoutFocus = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (!dialog) return;
    dialog.inert = true;
    dialog.showModal();
    dialog.inert = false;
};

export const closeModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (!dialog) return;
    dialog.close();
};
