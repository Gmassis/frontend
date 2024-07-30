import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-profile.component.html',
  styleUrl: './card-profile.component.scss',
})
export class CardProfileComponent {
  public profile = input.required<string>();
  public outputProfile = output();

  public onClickProfileHandle(): void {
    this.outputProfile.emit();
  }
}
