import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastService } from '../../services/toast.service';
import { Restaurant } from '../../models/restaurant';

@Component({
  selector: 'app-select-table-dialog',
  templateUrl: './select-table-dialog.component.html',
  styleUrls: ['./select-table-dialog.component.scss']
})
export class SelectTableDialogComponent implements OnInit {
  selectedOption: string | null = null;
  tables: number[] = [];
  selectedTable: number | null = null;
  activeRestaurant: Restaurant = {} as Restaurant;
  isTableAvail: boolean = true;

  constructor(
    private toastService: ToastService,
    private firestore: AngularFirestore,
    public dialogRef: MatDialogRef<SelectTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getNumberOfTables();
    console.log(this.data);
  }

  getNumberOfTables(): number[] {
    return Array.from({ length: this.data.numberTables }, (_, i) => i + 1);
  }

  isTableOccupied(tableIndex: number): boolean {
    return this.data.tables[tableIndex] && this.data.tables[tableIndex].length > 1;
  }

  onTableChange(selectedTable: number) {
    this.selectedTable = selectedTable;
    const isOccupied = this.isTableOccupied(selectedTable - 1);

    if (isOccupied) {
      this.isTableAvail = false;
    } else {
      this.isTableAvail = true;
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  get canConfirm(): boolean {
    return !!this.selectedTable && !!this.selectedOption;
  }

  confirmSelection() {
    if (this.canConfirm) {
      this.dialogRef.close({ option: this.selectedOption, table: this.selectedTable });
    } else {
      this.toastService.showToast('Please select a table and an option', 'error');
    }
  }
}
