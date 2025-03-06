import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  personOutline,
  alertCircleOutline,
  imageOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { IonButton, IonAvatar } from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
  imports: [
    IonIcon,
    HeaderComponent,
    IonContent,
    CommonModule,
    FormsModule,
    CustomInputComponent,
    ReactiveFormsModule,
    IonButton,
    IonAvatar,
  ],
})
export class AddUpdateTaskComponent implements OnInit {
  @Input() task: Task | null = null;
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      personOutline,
      alertCircleOutline,
      imageOutline,
      checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
    if (this.task) {
      this.form.setValue(this.task)
    }
  }

  async takeImage() {
    const dataUrl = (
      await this.utilsService.takePicture('Imagen de la tarea')
    ).dataUrl;
    if (dataUrl) {
      this.form.controls.image.setValue(dataUrl);
    }
  }

  async submit() {
    if (this.form.valid) {
      if (this.task) {
        this.UpdateTask();
      } else {
        this.createTask();
      }
    }
  }

  async createTask() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/tasks`;
    const imageDataUrl = this.form.value.image;
    const imagePath = `${this.user.uid}/${Date.now()}`;
    const imageUrl = await this.firebaseService.uploadImage(
      imagePath,
      imageDataUrl!
    );
    this.form.controls.image.setValue(imageUrl);
    delete this.form.value.id;

    this.firebaseService
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({ success: true });
        this.utilsService.presentToast({
          message: 'Tarea añadida exitosamente',
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

  async UpdateTask() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/tasks/${this.task!.id}`;
    if (this.form.value.image != this.task!.image) {
      const imageDataUrl = this.form.value.image;
      const imagePath = await this.firebaseService.getFilePath(this.task!.image)
      const imageUrl = await this.firebaseService.uploadImage(
        imagePath,
        imageDataUrl!
      );
      this.form.controls.image.setValue(imageUrl);
    }
    delete this.form.value.id;

    this.firebaseService
      .updateDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({ success: true });
        this.utilsService.presentToast({
          message: 'Tarea editada exitosamente',
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

}