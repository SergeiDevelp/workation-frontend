import { Component, OnInit } from '@angular/core';
import { WorkationService } from './workation.service';
import { Workation } from './workation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workation-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 1200px; margin: 0 auto; padding: 16px; font-family: Arial, sans-serif;">
      <table class="workation-table">
        <thead class="table-header">
        <tr>
          <th class="sortable-header" (click)="sort('workationId')">
            Workation ID
            <span class="sort-icon">{{ getSortIcon('workationId') }}</span>
          </th>
          <th class="sortable-header" (click)="sort('employee')">
            Employee
            <span class="sort-icon">{{ getSortIcon('employee') }}</span>
          </th>
          <th class="sortable-header" (click)="sort('origin')">
            Origin
            <span class="sort-icon">{{ getSortIcon('origin') }}</span>
          </th>
          <th class="sortable-header" (click)="sort('destination')">
            Destination
            <span class="sort-icon">{{ getSortIcon('destination') }}</span>
          </th>
          <th class="sortable-header" (click)="sort('startDate')">
            Start Date
            <span class="sort-icon">{{ getSortIcon('startDate') }}</span>
          </th>
          <th class="sortable-header" (click)="sort('endDate')">
            End Date
            <span class="sort-icon">{{ getSortIcon('endDate') }}</span>
          </th>
          <th class="sortable-header" (click)="sort('workingDays')">
            Working Days
            <span class="sort-icon">{{ getSortIcon('workingDays') }}</span>
          </th>
          <th class="sortable-header" (click)="sort('risk')">
            Risk
            <span class="sort-icon">{{ getSortIcon('risk') }}</span>
          </th>
        </tr>
        </thead>
        <tbody class="table-body">
        <tr *ngFor="let workation of workations; let i = index"
            class="table-row"
            [class.odd-row]="i % 2 === 1"
            [class.even-row]="i % 2 === 0">
          <td class="table-cell">{{ workation.workationId }}</td>
          <td class="table-cell">{{ workation.employee }}</td>
          <td class="table-cell">{{ workation.origin }}</td>
          <td class="table-cell">
            <span class="fi fi-{{ getCountryCode(workation.destination) }}" style="margin-right: 5px;"></span>
            {{ workation.destination }}
          </td>
          <td class="table-cell">{{ workation.startDate | date:'dd/MM/yyyy' }}</td>
          <td class="table-cell">{{ workation.endDate | date:'dd/MM/yyyy' }}</td>
          <td class="table-cell">{{ workation.workingDays }}</td>
          <td class="table-cell">
            <img [attr.src]="'assets/' + getRiskIcon(workation.risk)" alt="Risk icon" class="risk-icon">
            <span [style.color]="getRiskColor(workation.risk)" class="risk-label">
                                {{ getRiskLabel(workation.risk) }}
                            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .workation-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      font-size: 14px;
    }

    .table-header {
      background-color: #f0f8ff;
      border-bottom: 2px solid #dee2e6;
    }

    .table-header th {
      padding: 12px 16px 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #495057;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
      position: relative;
      min-width: 120px;
    }

    .table-header th:hover {
      background-color: #e9ecef;
    }

    .sort-icon {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      opacity: 0.5;
      transition: opacity 0.2s;
    }

    .table-header th:hover .sort-icon {
      opacity: 1;
    }

    .table-body tr {
      border-bottom: 1px solid #dee2e6;
      transition: background-color 0.2s ease;
    }

    .table-body tr:hover {
      background-color: #f1f3f5 !important;
    }

    .odd-row {
      background-color: #f8f9fa;
    }

    .even-row {
      background-color: #ffffff;
    }

    .table-cell {
      padding: 12px 16px;
    }

    .risk-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      vertical-align: middle;
    }

    .risk-label {
      font-weight: 500;
    }


    @media (max-width: 768px) {
      .workation-table {
        font-size: 12px;
      }
      .table-cell {
        padding: 8px 12px;
      }
      .table-header th {
        min-width: auto;
      }
    }
  `]
})
export class WorkationListComponent implements OnInit {
  workations: Workation[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private workationService: WorkationService) { }

  ngOnInit() {
    this.workationService.getWorkations().subscribe(data => {
      this.workations = data;
    });
  }

  sort(column: keyof Workation) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.workations.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];
      let cmp: number;
      if (typeof valA === 'number' && typeof valB === 'number') {
        cmp = valA - valB;
      } else {
        cmp = valA.toString().localeCompare(valB.toString());
      }
      return this.sortDirection === 'asc' ? cmp : -cmp;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? ' ▴' : ' ▾';
  }

  getCountryCode(country: string): string {
    const countryCodes: { [key: string]: string } = {
      'Germany': 'de',
      'United States': 'us',
      'Ukraine': 'ua',
      'Belgium': 'be',
      'Spain': 'es',
      'Greece': 'gr',
      'India': 'in'
    };
    return countryCodes[country] || '';
  }

  getRiskIcon(risk: string): string {
    if (risk === 'NO') return 'green-risk.svg';
    if (risk === 'LOW') return 'yellow-risk.svg';
    if (risk === 'HIGH') return 'red-risk.svg';
    return 'default-risk.svg';
  }

  getRiskColor(risk: string): string {
    if (risk === 'NO') return 'green';
    if (risk === 'LOW') return 'orange';
    if (risk === 'HIGH') return 'red';
    return 'black';
  }

  getRiskLabel(risk: string): string {
    if (risk === 'HIGH') return 'High risk';
    return 'No risk';
  }
}
