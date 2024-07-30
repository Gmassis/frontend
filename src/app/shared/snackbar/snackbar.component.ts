import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent implements OnChanges {
  public message = input.required<string>();

  constructor(private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'].firstChange) return;
    if (!this.message() || this.message() === '') return;
    this.openSnackBar();
  }

  private openSnackBar() {
    this.snackBar.open(this.message(), 'Close', { duration: 3000 });
  }
}
