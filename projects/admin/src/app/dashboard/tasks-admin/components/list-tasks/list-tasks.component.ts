import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../manage-users/services/users.service';

export interface PeriodicElement {
  title: string;
  user: string;
  deadline: string;
  status: string;
}

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
    'deadline',
    'status',
    'actions',
  ];
  dataSource: any = [];
  tasksFilter!: FormGroup;
  users: any = [];

  status: any = [
    { name: this.translate.instant('tasks.Complete') },
    { name: this.translate.instant('tasks.In-Progress') },
  ];

  page: any = 1;
  filtration: any = {
    page: this.page,
    limit: 10,
  };
  timeOutId: any;
  total: any;

  constructor(
    private service: TasksService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private translate: TranslateService,
    private userServices: UsersService
  ) {
    this.getDataFromSubject();
  }

  ngOnInit(): void {
    this.getAllTasks();
    this.getAllUser();
  }

  getAllUser() {
    this.userServices.getUserData();
  }

  getDataFromSubject() {
    this.userServices.userData.subscribe((res: any) => {
      this.users = this.usersMapping(res.data);
      // console.log(this.users);
    });
  }

  usersMapping(data: any[]) {
    let newArray = data?.map((item) => {
      return {
        name: item.username,
        id: item._id,
      };
    });
    return newArray;
  }

  search(event: any) {
    this.filtration['keyword'] = event.value;
    this.page = 1;
    this.filtration['page'] = 1;
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      this.getAllTasks();
    }, 1000);
  }

  selectUser(event: any) {
    this.page = 1;
    this.filtration['page'] = 1;
    this.filtration['userId'] = event.value;
    this.getAllTasks();
  }

  selectStatus(event: any) {
    this.page = 1;
    this.filtration['page'] = 1;
    this.filtration['status'] = event.value.trim();
    this.getAllTasks();
  }

  selectDate(event: any, type: any) {
    this.page = 1;
    this.filtration['page'] = 1;
    this.filtration[type] = moment(event.value).format('DD-MM-YYYY');
    if (type == 'toDate' && this.filtration['toDate'] !== 'Invalid date') {
      this.getAllTasks();
    }
  }

  getAllTasks() {
    this.service.getAllTasks(this.filtration).subscribe((res: any) => {
      this.dataSource = this.mappingTasks(res.tasks);
      this.total = res.totalItems;
    });
  }

  mappingTasks(data: any[]) {
    let newTasks = data.map((item) => {
      return {
        ...item,
        user: item.userId.username,
      };
    });
    return newTasks;
    // console.log(newTasks)
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '700px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTasks();
      }
      console.log(result);
    });
  }

  deleteTask(id: any) {
    this.service.deleteTask(id).subscribe((res) => {
      this.getAllTasks();
    });
  }

  updateTask(element: any) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '700px',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTasks();
      }
      console.log(result);
    });
  }

  changePage(event: any) {
    this.page = event;
    this.filtration['page'] = event;
    this.getAllTasks();
  }
}
