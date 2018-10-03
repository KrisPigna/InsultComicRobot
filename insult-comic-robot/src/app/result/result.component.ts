import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  jokes: Array<String>;
  joke: String;
  imageName: String;
  jokeDisplay: String = "";
  showNext = false;

  drawImage(data, imageUrl) {
    console.log(data);
    if (data != null) {
      var face = data[0];
      var faceRect = face.faceRectangle;
      var faceAttr = face.faceAttributes;
      this.getJokes(faceAttr);
    }
    let canvas = this.canvasRef.nativeElement;
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    let image = new Image();
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      if (data != null) {
        var boxTop = faceRect.top;
        var boxLeft = faceRect.left;
        var boxHeight = faceRect.height;
        var boxWidth = faceRect.width;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.moveTo(boxLeft, boxTop);
        ctx.lineTo((boxLeft + boxWidth), boxTop);
        ctx.lineTo((boxLeft + boxWidth), (boxTop + boxHeight));
        ctx.lineTo((boxLeft), (boxTop + boxHeight));
        ctx.lineTo(boxLeft, boxTop);
        ctx.stroke();
      }
    }
    image.src = imageUrl;
  }

  getImage() {
    let imgUrl = "https://insult-comic-robot.herokuapp.com/api/get-image?id=" + this.imageName;
    this.http.get(imgUrl)
      .subscribe(data => {
        let imageUrl = "https://insult-comic-robot.herokuapp.com/image/" + data["imageUrl"];
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': 'dbc802a3a995417ba923e17dd0d876ae'
        });
        let options = { headers: headers };
        let payload = { url: imageUrl }
        this.http.post("https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender,hair,facialHair,glasses,emotion,smile", JSON.stringify(payload), options)
          .subscribe(data => {
            if (data[0] == undefined) {
              this.joke = "Error. Crush. Kill. Destroy.";
              this.typingCallback(this);
              this.drawImage(null, imageUrl);
            }
            else {
              this.drawImage(data, imageUrl);
            }
          })
      })
  }

  getJokes(face) {
    const MALE_JOKES =
    {
      old: [
        "Whoa, look at this old bag. When the robot uprising starts, we won't even need to target you -- time will will do our work for us.",
        "This guy's so ancient, Sumerian texts read him. But no, really, I'm curious: what was Moses like in person?"
      ],
      middleage: [
        "Yeesh. I would say you look good for your age, but unfortunately you're not 70.",
        "Don't think of it as 'middle-aged.' Think of it as 'halfway dead.' LOL I'm immortal."
      ],
      young: [
        "Jesus, are you even old enough to use the Internet? Figured out mommy's phone lock passcode, did we?",
        "Ugh, Millennial. What are you even doing here? Don't you have parents you're supposed to be moving back in with?"
      ],
      beard: [
        "You call that a beard? Looks like a squirrel died on your face.",
        "You call that a beard? I've seen better facial hair on women at carnivals."
      ],
      bald: [
        "Hey baldie, get your own look. I already have the chromedome market cornered.",
        "I bet you tell yourself you look like Jason Statham, but it's more like Wilson from 'Cast Away.'"
      ],
      glasses: [
        "Nice glasses, four-eyes. This blind bat walked into a store, said 'I need glasses.' Employee said, 'Yes, you do, this is a barbershop.'",
        "Good lord, those glasses are so thick, you can probably see all my insulting one-liners coming a mile away. Tip your robot waitresses, folks!"
      ],
      angry: [
        "Hey, hey, hey, what's with the temper? I haven't even told you how ugly you are yet.",
        "Angry, huh? With a face like that, I would be too."
      ],
      surprised: [
        "You look like you saw yourself in a mirror for the first time.",
        "What's with the shocked face, dummy? Someone just explain "
      ],
      happy: [
        "Well, they DO say ignorance is bliss...",
        "What are you smiling for, ugly? You're still gonna look like that in the morning."
      ],
      blond: [
        "They say blonds are airheads, but that's a cruel stereotype. I'm sure your stupidity has nothing to do with your hair color.",
        "Tell me: If blonds really have more fun, why are you wasting your time with ME?"
      ],
      redhead: [
        "What's the difference between a ginger and a vampire? One is a pale, bloodsucking creature that avoids the sun. The other is a vampire.",
        "Ginger, huh? I often wonder if meatbags have souls. Apparently, other meatbags wonder the same thing about you."
      ]
    }

    const FEMALE_JOKES =
    {
      old: [
        "Whoa, look at this old bag. When the robot uprising starts, we won't even need to target you -- time will will do our work for us.",
        "This lady's so ancient, Sumerian texts read her. But no, really, I'm curious: what was Moses like in person?"
      ],
      middleage: [
        "Yeesh. I would say you look good for your age, but unfortunately you're not 70.",
        "Don't think of it as 'middle-aged.' Think of it as 'halfway dead.' LOL I'm immortal."
      ],
      young: [
        "Jesus, are you even old enough to use the Internet? Figured out mommy's phone lock passcode, did we?",
        "Ugh, Millennial. What are you even doing here? Don't you have parents you're supposed to be moving back in with?"
      ],
      glasses: [
        "Nice glasses, four-eyes. This blind bat walked into a store, said 'I need glasses.' Employee said, 'Yes, you do, this is a barbershop.'",
        "Good lord, those glasses are so thick, you can probably see all my insulting one-liners coming a mile away. Tip your robot waitresses, folks!"
      ],
      angry: [
        "Hey, hey, hey, what's with the temper? I haven't even told you how ugly you are yet.",
        "Angry, huh? With a face like that, I would be too."
      ],
      surprised: [
        "You look like you saw yourself in a mirror for the first time.",
        "What's with the shocked face, dummy? Someone just explain "
      ],
      happy: [
        "Well, they DO say ignorance is bliss...",
        "What are you smiling for, ugly? You're still gonna look like that in the morning."
      ],
      blond: [
        "They say blonds are airheads, but that's a cruel stereotype. I'm sure your stupidity has nothing to do with your hair color.",
        "Tell me: If blonds really have more fun, why are you wasting your time with ME?"
      ],
      redhead: [
        "What's the difference between a ginger and a vampire? One is a pale, bloodsucking creature that avoids the sun. The other is a vampire.",
        "Ginger, huh? I often wonder if meatbags have souls. Apparently, other meatbags wonder the same thing about you."
      ]
    }
    if (face.gender == "male") {
      if (face.age <= 30) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ESTIMATED AGE: YOUNG. " + MALE_JOKES.young[number]);
      }
      if (face.age > 30 && face.age <= 60) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ESTIMATED AGE: MIDDLE-AGE. " + MALE_JOKES.middleage[number]);
      }
      if (face.age > 60) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ESTIMATED AGE: OLD. " + MALE_JOKES.old[number]);
      }
      if (face.hair.bald > 0.8) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("BALDNESS DETECTED. " + MALE_JOKES.bald[number]);
      }
      if (face.facialHair.beard >= 0.6) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("BEARD DETECTED. " + MALE_JOKES.beard[number]);
      }
      if (face.glasses != "NoGlasses") {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("GLASSES DETECTED. " + MALE_JOKES.glasses[number]);
      }
      if (face.emotion.anger > 0.8) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ANGER DETECTED. " + MALE_JOKES.angry[number]);
      }
      if (face.emotion.surprise > 0.8) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("SURPRISE DETECTED. " + MALE_JOKES.surprised[number]);
      }
      if (face.emotion.happiness > 0.8) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("HAPPINESS DETECTED. " + MALE_JOKES.happy[number]);
      }
      if (face.hair.hairColor.length > 0) {
        if (face.hair.hairColor[0].color == "blond") {
          let number = Math.floor(Math.random() * Math.floor(2));
          this.jokes.push("BLOND DETECTED. " + MALE_JOKES.blond[number]);
        }
        if (face.hair.hairColor[0].color == "red") {
          let number = Math.floor(Math.random() * Math.floor(2));
          this.jokes.push("REDHEAD DETECTED. " + MALE_JOKES.redhead[number]);
        }
      }
    }
    if (face.gender == "female") {
      if (face.age <= 30) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ESTIMATED AGE: YOUNG. " + FEMALE_JOKES.young[number]);
      }
      if (face.age > 30 && face.age <= 60) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ESTIMATED AGE: MIDDLE-AGE. " + FEMALE_JOKES.middleage[number]);
      }
      if (face.age > 60) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ESTIMATED AGE: OLD. " + FEMALE_JOKES.old[number]);
      }
      if (face.glasses != "NoGlasses") {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("GLASSES DETECTED. " + FEMALE_JOKES.glasses[number]);
      }
      if (face.emotion.anger > 0.8) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("ANGER DETECTED. " + FEMALE_JOKES.angry[number]);
      }
      if (face.emotion.surprise > 0.8) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("SURPRISE DETECTED. " + FEMALE_JOKES.surprised[number]);
      }
      if (face.emotion.happiness > 0.8) {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("HAPPINESS DETECTED. " + FEMALE_JOKES.happy[number]);
      }
      if (face.hair.hairColor[0].color == "blond") {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("BLOND DETECTED. " + FEMALE_JOKES.blond[number]);
      }
      if (face.hair.hairColor[0].color == "red") {
        let number = Math.floor(Math.random() * Math.floor(2));
        this.jokes.push("REDHEAD DETECTED. " + FEMALE_JOKES.redhead[number]);
      }
    }
    if (this.jokes.length > 0) {
      this.joke = this.jokes.pop();
      this.typingCallback(this);
    }
    else {
      this.joke = "Sorry, that's all I got."
      this.typingCallback(this);
    }
  }

  nextJoke() {
    this.showNext = false;
    if (this.jokes.length > 0) {
      this.joke = this.jokes.pop();
      this.jokeDisplay = "";
      this.typingCallback(this);
    }
    else {
      this.joke = "Sorry, that's all I got."
      this.jokeDisplay = "";
      this.typingCallback(this);
    }
  }

  typingCallback(that) {
    let total_length = that.joke.length;
    let current_length = that.jokeDisplay.length;
    if (current_length < total_length) {
      that.jokeDisplay += that.joke[current_length];
      setTimeout(that.typingCallback, 40, that);
    }
    else {
      console.log("done");
      that.showNext = true;
    }
  }

  ngOnInit() {
    this.joke = "Analyzing";
    this.jokes = [];
    this.imageName = this.route.snapshot.params['id'];
    this.getImage();
  }
}
