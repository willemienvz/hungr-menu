import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-options-dialog',
  templateUrl: './select-options-dialog.component.html',
  styleUrls: ['./select-options-dialog.component.scss']
})
export class SelectOptionsDialogComponent {
  selectedOptions = {
    variation: null,
    side: null,
    preparation: null
  };

  constructor(
    public dialogRef: MatDialogRef<SelectOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmSelection() {
    this.dialogRef.close(this.selectedOptions); 
  }
}
