import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {IonCard,
  IonContent,
  IonFab,
  IonIcon,
  IonFabButton,
  IonButton,
  IonSkeletonText,
  IonLabel,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonItem,
  IonAvatar,
  IonList,
  IonChip,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline, bodyOutline } from 'ionicons/icons';
import { min } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { QueryOptions } from 'src/app/services/query-options.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCard,
    IonChip,
    IonList,
    IonSkeletonText,
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
    IonRefresher,
    IonRefresherContent,
  ],
})
export class HomePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);
  tasks: Task[] = [];
  loading: boolean = false;
  constructor() {
    addIcons({createOutline,trashOutline,bodyOutline,add});
  }

  ngOnInit() {}

  getTasks() {
    this.loading = true;
    const user: User = this.utilsService.getLocalStoredUser()!;
    const path: string = `users/${user.uid}/tasks`;

    const queryOptions: QueryOptions = {
      orderBy: { field: 'name', direction: 'desc' },
    };

    let timer: any;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(
          'No hay más novedades en 5 segundos. Cancelando suscripción.'
        );
        sub.unsubscribe();
        this.loading = false;
      }, 5000);
    };

    const sub = this.firebaseService
      .getCollectionData(path, queryOptions)
      .subscribe({
        next: (res: any) => {
          this.tasks = res;
          this.loading = false;

          resetTimer();
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
          this.loading = false;

          if (timer) clearTimeout(timer);
        },
      });

    resetTimer();
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getTasks();
      event.target.complete();
    }, 2000);
  }

  async deleteTask(task: Task) {
    const loading = await this.utilsService.loading();
    await loading.present();
    const user: User = this.utilsService.getLocalStoredUser()!;
    const path: string = `users/${user.uid}/tasks/${task!.id}`;

    const imagePath = await this.firebaseService.getFilePath(task!.image)
    await this.firebaseService.deleteFile(imagePath);
    this.firebaseService
      .deleteDocument(path)
      .then(async (res) => {
        this.tasks = this.tasks.filter(listedTask => listedTask.id !== task.id)
        this.utilsService.presentToast({
          message: 'Tarea borrada exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async confirmDeleteTask(task: Task) {
    this.utilsService.presentAlert({
      header: 'Eliminar tarea',
      message: '¿Está seguro de que desea eliminar la tarea?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteTask(task);

          },
        },
      ],
    });
  }
}