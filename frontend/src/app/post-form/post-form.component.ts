import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { Post } from '../models/Post.model';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  postForm!: FormGroup;
  mode!: string;
  loading!: boolean;
  post!: Post;
  errorMsg!: string;
  imagePreview!: string;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private posts: PostsService,
              private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.posts.getPostById(params['id'])
        }
      }),
      tap(post => {
        if (post) {
          this.post = post;
          this.initModifyForm(post);
          this.loading = false;
        }
      }),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      //name: [null, Validators.required],
      //manufacturer: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required],
      //mainPepper: [null, Validators.required],
      //heat: [1, Validators.required],
      //heatValue: [{value: 1, disabled: true}]
    });
    //this.postForm.get('heat')!.valueChanges.subscribe(
      //(value) => {
        //this.postForm.get('heatValue')!.setValue(value);
      //}
    //);
  }

  initModifyForm(post: Post) {
    this.postForm = this.formBuilder.group({
      //name: [post.name, Validators.required],
      //manufacturer: [post.manufacturer, Validators.required],
      description: [post.description, Validators.required],
      image: [post.imageUrl, Validators.required],
      //mainPepper: [post.mainPepper, Validators.required],
      //heat: [post.heat, Validators.required],
      //heatValue: [{value: post.heat, disabled: true}]
    });
    //this.postForm.get('heat')!.valueChanges.subscribe(
      //(value) => {
        //this.postForm.get('heatValue')!.setValue(value);
      //}
    //);
    this.imagePreview = this.post.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newPost = new Post();
    //newPost.name = this.postForm.get('name')!.value;
    //newPost.manufacturer = this.postForm.get('manufacturer')!.value;
    newPost.description = this.postForm.get('description')!.value;
    //newPost.mainPepper = this.postForm.get('mainPepper')!.value;
    //newPost.heat = this.postForm.get('heat')!.value;
    newPost.userId = this.auth.getUserId();
    if (this.mode === 'new') {
      this.posts.createPost(newPost, this.postForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/posts']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else if (this.mode === 'edit') {
      this.posts.modifyPost(this.post._id, newPost, this.postForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/posts']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.postForm.get('image')!.setValue(file);
    this.postForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
