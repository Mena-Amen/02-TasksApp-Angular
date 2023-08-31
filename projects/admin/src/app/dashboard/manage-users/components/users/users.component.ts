import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeStatus } from './../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'tasksAssigned',
    'actions',
  ];
  dataSource: any = [];

  page = 1;
  totalItems: any;

  constructor(private services: UsersService, private toaster: ToastrService) {
    this.getDataFromSubject();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    const MODEL = {
      page: this.page,
      limit: 10,
      name: '',
    };
    this.services.getUserData(MODEL);
  }

  getDataFromSubject() {
    this.services.userData.subscribe((res: any) => {
      this.dataSource = res.data;
      this.totalItems = res.total;
    });
  }

  changePage(event: any) {
    this.page = event;
    this.getUser();
  }

  deleteOneUser(id: any, index: number) {
    if (this.dataSource[index].assignedTasks > 0) {
      this.toaster.error("You Can't Delete This User Until Finish His Tasks");
    } else {
      this.services.deleteUser(id).subscribe((res: any) => {
        this.toaster.success('User Has Been Deleted Successfully', 'success');
        this.getUser();
      });
    }
  }

  changeUserStatus(status: string, id: string, index: number) {
    const Model: ChangeStatus = {
      status,
      id,
    };
    if (this.dataSource[index].assignedTasks > 0) {
      this.toaster.error("You Can't Delete This User Until Finish His Tasks");
    } else {
      this.services.changeStatus(Model).subscribe((res: any) => {
        this.toaster.success(
          'User Status Has Been Changed Successfully',
          'success'
        );
        this.getUser();
      });
    }
  }
}
