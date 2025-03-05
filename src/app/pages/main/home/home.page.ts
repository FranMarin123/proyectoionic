import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonFab,
  IonIcon,
  IonFabButton,
  IonButton,
  IonLabel,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonItem,
  IonAvatar,
  IonList,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import { min } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonList,
    IonAvatar,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonFabButton,
    IonIcon,
    IonFab,
    HeaderComponent,
    IonContent,
    CommonModule,
  ],
})
export class HomePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  tasks: Task[] = [];
  constructor() {
    addIcons({ createOutline, trashOutline, add });
  }

  ngOnInit() {}

  getTasks() {
    const user: User = this.utilsService.getLocalStoredUser()!;
    const path: string = `users/${user.uid}/tasks`;

    let sub = this.firebaseService.getCollectionData(path).subscribe({
      next: (res: any) => {
        sub.unsubscribe();

        this.tasks = res;
      },
    });
  }

  async addUpdateTask(task? : Task) {
    let success = await this.utilsService.presentModal({
      component: AddUpdateTaskComponent,
      cssClass: 'add-update-modal',
      componentProps: {task}
    });
    if (success){
      this.getTasks()
    }
  }

  ionViewWillEnter() {
    this.getTasks();
  }
}