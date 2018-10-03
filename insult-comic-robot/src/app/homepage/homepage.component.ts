import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  private typewriter_text: string = "Insert face, meatbag, and I will initiate jokes at your expense.";
  private typewriter_display: string = "";

  constructor() { }

  typingCallback(that) {
    let total_length = that.typewriter_text.length;
    let current_length = that.typewriter_display.length;
    if (current_length < total_length) {
      that.typewriter_display += that.typewriter_text[current_length];
    }
    setTimeout(that.typingCallback, 40, that);
  }

  ngOnInit() {
    this.typingCallback(this);
  }

}
