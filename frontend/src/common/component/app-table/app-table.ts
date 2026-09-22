import { Component, computed, input } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; 
import type { ColDef } from 'ag-grid-community';
import { appGridTheme } from '../../const/app-table.const';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
	imports: [AgGridAngular],
	selector: 'app-table',
	styleUrl: './app-table.css',
	templateUrl: './app-table.html',
	host: {
		class: 'block bg-inherit'
	}
})
export class AppTable {

	theme = appGridTheme;
	colDefs = input.required<ColDef[]>();
	rowData = input.required<any[]>();
	dColDef = input<ColDef>(undefined, {
		alias: 'defaultColDef'
	});

	defaultColDef = computed(() => {
		const defaultColDefValue = this.dColDef();
		const baseColDef = {
			flex: 1,
			sortable: true,
			filter: true,
			resizable: true
		};
		return {
			...baseColDef,
			...defaultColDefValue
		};
	});

}