import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Inject, Injectable, Injector, Type } from "@angular/core";
import { DIALOG_DATA, DialogConfig } from "../../interface/app/app-dialog";
import { DOCUMENT } from '@angular/common';
import { AppDialog } from "./app-dialog";
import { DialogRef } from "./app-dialog-ref";


@Injectable({ providedIn: 'root' })
export class DialogService {

    constructor(
        private readonly applicationRef: ApplicationRef,
        private readonly environmentInjector: EnvironmentInjector,
        @Inject(DOCUMENT)
        private readonly document: Document,
    ) {}

    open<Component, Data = unknown, Result = unknown>(
        component: Type<Component>,
        config?: DialogConfig<Data>,
    ): DialogRef<Result>{

        const previouslyFocusedElement = this.document.activeElement as HTMLElement | null;
        const hostElement = this.document.createElement('app-dialog');
        this.document.body.appendChild(hostElement);

        let dialogComponentRef: ComponentRef<AppDialog> = createComponent(AppDialog, {
            environmentInjector: this.environmentInjector,
            hostElement,
        });

        const dialogRef = new DialogRef<Result>(() => {
            this.applicationRef.detachView(dialogComponentRef.hostView);
            dialogComponentRef.destroy();
            hostElement.remove();
            previouslyFocusedElement?.focus();
        });

        const contentInjector = Injector.create({
            parent: this.environmentInjector,
            providers: [
                { provide: DialogRef, useValue: dialogRef },
                { provide: DIALOG_DATA, useValue: config?.data },
            ]
        });

        dialogComponentRef.setInput('content', component);
        dialogComponentRef.setInput('contentInjector', contentInjector);
        dialogComponentRef.setInput('dialogRef', dialogRef);
        dialogComponentRef.setInput('config', config ?? {});

        this.applicationRef.attachView(dialogComponentRef.hostView);
        dialogComponentRef.changeDetectorRef.detectChanges();
        dialogComponentRef.instance.open();

        return dialogRef;

    }

}