class CustomDialog {
    constructor() {
        this.dialogElement = document.getElementById('customConfirmationDialog');
        this.cancelButton = this.dialogElement.querySelector('.custom-cancel');
        this.acceptButton = this.dialogElement.querySelector('.custom-accept');

        this.boundOnAccept = () => this.onAccept();
        this.boundOnCancel = () => this.onCancel();

        this.cancelButton.addEventListener('click', this.boundOnCancel);
        this.acceptButton.addEventListener('click', this.boundOnAccept);
    }

    show() {
        this.dialogElement.style.display = 'flex';
    }

    hide() {
        this.dialogElement.style.display = 'none';
    }

    onAccept() {
        // Comportamiento por defecto o lógica personalizada
    }

    onCancel() {
        // Comportamiento por defecto o lógica personalizada
    }

    setOnAccept(callback) {
        this.acceptButton.removeEventListener('click', this.boundOnAccept);
        this.boundOnAccept = () => callback();
        this.acceptButton.addEventListener('click', this.boundOnAccept);
    }

    setOnCancel(callback) {
        this.cancelButton.removeEventListener('click', this.boundOnCancel);
        this.boundOnCancel = () => callback();
        this.cancelButton.addEventListener('click', this.boundOnCancel);
    }
}
const confirmationDialog = new CustomDialog();