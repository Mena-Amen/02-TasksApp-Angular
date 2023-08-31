import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { UsersService } from '../../../manage-users/services/users.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  newTaskForm!: FormGroup;
  imageFile = '';
  formValues: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialogRef<AddTaskComponent>,
    public matDialog: MatDialog,
    private service: TasksService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private userServices: UsersService
  ) {
    this.getDataFromSubject();
  }

  users: any = [];
  ngOnInit(): void {
    this.createForm();
  }

  getDataFromSubject() {
    this.userServices.userData.subscribe((res: any) => {
      this.users = this.usersMapping(res.data);
      // console.log(this.users);
    });
  }

  usersMapping(data: any[]) {
    let newArray = data.map((item) => {
      return {
        name: item.username,
        id: item._id,
      };
    });
    return newArray;
  }

  createForm() {
    this.newTaskForm = this.fb.group({
      title: [
        this.data?.title || '',
        [Validators.required, Validators.minLength(5)],
      ],
      userId: [this.data?.userId._id || '', Validators.required],
      image: [this.data?.image || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      deadline: [
        this.data
          ? new Date(
              this.data?.deadline.split('-').reverse().join('-')
            ).toISOString()
          : '',
        Validators.required,
      ],
    });
    this.formValues = this.newTaskForm.value;
  }

  selectImage(event: any) {
    this.imageFile = event.target.value;
    this.newTaskForm.get('image')?.setValue(event.target.files[0]);
    console.log(event);
  }

  createTask() {
    let model = this.prepareFormData();
    this.service.createTask(model).subscribe(
      (res) => {
        this.toaster.success('Task Created Successfully', 'Success');
        this.dialog.close(true);
      },
      (error) => {
        // console.log(error);

        this.toaster.error(error.error.message);
      }
    );
  }

  prepareFormData() {
    let newDate = moment(this.newTaskForm.value['deadline']).format(
      'DD-MM-YYYY'
    );

    let formData = new FormData();
    Object.entries(this.newTaskForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newDate);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }

  updateTask() {
    let model = this.prepareFormData();
    this.service.updateTask(model, this.data._id).subscribe(
      (res) => {
        this.toaster.success('Task Updated Successfully', 'Success');
        this.dialog.close(true);
      },
      (error) => {
        // console.log(error);

        this.toaster.error(error.error.message);
      }
    );
  }

  close() {
    let hasChanged = false;
    Object.keys(this.formValues).forEach((item) => {
      if (this.formValues[item] !== this.newTaskForm.value[item]) {
        hasChanged = true;
      }
    });
    if (hasChanged) {
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '700px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
        }
      });
    } else {
      this.dialog.close();
    }
  }
}
