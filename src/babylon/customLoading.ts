import { ILoadingScreen } from "@babylonjs/core";
// import { setAndStartTimer } from "babylonjs";

export class CustomLoading implements ILoadingScreen {
    loadingUIBackgroundColor!: string;
    loadingUIText!: string;

    constructor(
        private loader: HTMLElement,
        private loadingBar: HTMLElement,
    ) {}

    displayLoadingUI(): void {
        this.loadingBar.style.width = "0%";
    }

    hideLoadingUI(): void {
        this.loader.id = "loadingContainerLoaded";

        setTimeout(() => {
            this.loader.style.display = "none";
        }, 2000);
    }

    updateLoadStatus(status: string): void {
        this.loadingBar.style.width = `${status}%`;
    }
}