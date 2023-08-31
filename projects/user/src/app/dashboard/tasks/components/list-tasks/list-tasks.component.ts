import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'title',
    'user',
    'deadLineDate',
    'status',
    'actions',
  ];
  dataSource: any = [];
  tasksFilter!: FormGroup;
  users: any = [
    { name: 'Moahmed', id: 1 },
    { name: 'Ali', id: 2 },
    { name: 'Ahmed', id: 3 },
    { name: 'Zain', id: 4 },
  ];

  status: any = [
    { name: 'Complete', id: 1 },
    { name: 'In-Prossing', id: 2 },
  ];
  constructor(
    private services: TasksService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toaster: ToastrService
  ) {}

  page = 1;
  userData: any;
  selectedStatus: string = 'In-Progress';
  totalItems: any;

  ngOnInit(): void {
    this.createform();
    this.getUserDataTasks();
    this.getAllTasks();
  }

  createform() {
    this.tasksFilter = this.fb.group({
      title: [''],
      userId: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  getUserDataTasks() {
    let token = JSON.stringify(localStorage.getItem('token'));
    this.userData = JSON.parse(window.atob(token.split('.')[1]));
    console.log(this.userData);
  }

  getAllTasks() {
    let params = {
      page: this.page,
      limit: 10,
      status: this.selectedStatus,
    };
    this.services.getUserTasks(this.userData.userId, params).subscribe(
      (res: any) => {
        this.dataSource = res.tasks;
        this.totalItems = res.totalItems;
      },
      (error) => {
        this.dataSource = [];
      }
    );
  }

  changePage(event: any) {
    this.page = event;
    this.getAllTasks();
  }

  complete(ele: any) {
    const MODEL = {
      id: ele._id,
    };
    this.services.completeTask(MODEL).subscribe((res: any) => {
      this.getAllTasks();
      this.toaster.success('Task Completed Successfully');
    });
  }
}
