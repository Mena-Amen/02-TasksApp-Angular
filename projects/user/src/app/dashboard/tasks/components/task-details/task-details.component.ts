import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit {
  taskID: any;
  tasksDetails: any;
  constructor(
    private route: ActivatedRoute,
    private services: TasksService,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.route.paramMap.subscribe((res: any) => {
      this.taskID = res.params['id'];
    });
  }
  ngOnInit(): void {
    this.getTaskDetails();
  }

  getTaskDetails() {
    this.services.taskDetails(this.taskID).subscribe((res: any) => {
      this.tasksDetails = res.tasks;
    });
  }

  complete() {
    const MODEL = {
      id: this.taskID,
    };
    this.services.completeTask(MODEL).subscribe((res: any) => {
      this.router.navigate(['/tasks']);
      this.toaster.success('Task Completed Successfully');
    });
  }
}
