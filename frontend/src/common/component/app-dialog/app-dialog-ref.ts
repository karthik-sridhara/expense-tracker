import { Observable, Subject } from 'rxjs';

export class DialogRef<Result = unknown> {

    private readonly closedSubject = new Subject<Result | undefined>();
    private closed = false;

    constructor(
        private readonly dispose: () => void,
    ) {}

    afterClosed(): Observable<Result | undefined> {
        return this.closedSubject.asObservable();
    }

    close(result?: Result): void {
        if (this.closed) {
            return;
        }

        this.closed = true;
        this.dispose();
        this.closedSubject.next(result);
        this.closedSubject.complete();
    }
}