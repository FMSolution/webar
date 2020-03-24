var sound1;
var isTracking = 0;

AFRAME.registerComponent('heinekenframe', {
  schema: {
    name: {type: 'string'},
    rotated: {type: 'bool'},
    metadata: {type: 'string'},
  },
  init: function () {
    const container = document.getElementById('photoModeContainer')
    const image = document.getElementById('photoModeImage')
    const shutterButton = document.getElementById('shutterButton')
    const closeButton = document.getElementById('closeButton')

    // const loadButton = document.getElementById('loadImg')

    // Setup the sounds to be used.
    sound1 = new Howl({
      src: ['assets/Uefa.mp3', 'assets/Uefa.webm'],
      html5: true
    });

  sound1.once('load', function() {
  });


// Container starts hidden so it isn't visible when the page is still loading
    container.style.display = 'block'

    closeButton.addEventListener('click', () => {
      container.classList.remove('photo')
//      showhide(false, 'logo');
      showhide(true, 'PopupImg');
    })

    // loadButton.addEventListener('click', () => {
    // })

    shutterButton.addEventListener('click', () => {

      // Emit a screenshotrequest to the xrweb component
      this.el.sceneEl.emit('screenshotrequest')

      // Show the flash while the image is being taken
      container.classList.add('flash')
    })

    this.el.sceneEl.addEventListener('screenshotready', e => {
      // Hide the flash
      container.classList.remove('flash')

      // If an error occurs while trying to take the screenshot, e.detail will be empty.
      // We could either retry or return control to the user
      if (!e.detail) {
        return
      }

      // e.detail is the base64 representation of the JPEG screenshot
      image.src = 'data:image/jpeg;base64,' + e.detail

      // Show the photo
      container.classList.add('photo')
      showhide(false, 'PopupImg');
    })



    const {object3D, sceneEl} = this.el

    // Hide the image target until it is found
    object3D.visible = false

    const frameEl = document.createElement('a-entity')    
    frameEl.setAttribute('scale', '7 7 7')
    frameEl.setAttribute('position', '0 0 0')
    frameEl.setAttribute('rotation', '90 0 0')
    frameEl.setAttribute('animation-mixer', 'clip: *')
    frameEl.setAttribute('gltf-model', '#heineken')
    frameEl.setAttribute('cube-env-map', 'path: cubemap/; extension: jpg;')

    if (this.data.rotated) {
      // Rotate the frame for a landscape target
      frameEl.setAttribute('rotation', '0 90 90')
    }
    this.el.appendChild(frameEl)

    setTimeout(startTracking, 5000);

    isTracking = 0;

    var oldPos = 0;

    // showImage handles displaying and moving the virtual object to match the image
    const showImage = ({detail}) => {
      // Updating position/rotation/scale using object3D is more performant than setAttribute

      if(isTracking == 1)
      {
        if(oldPos < 1)
        {
          if(oldPos == 0)
          {
            if(!sound1.playing())
            {
              sound1.play();
            }

            // playSound();
            object3D.visible = true

            showhide(true, 'logo');

            setTimeout(Rescan, 40000);
          }

          object3D.position.copy(detail.position)
          object3D.quaternion.copy(detail.rotation)
          //object3D.scale.set(detail.scale * 1.5, detail.scale * 1.5, detail.scale * 1.5)

          console.log(object3D.position);

          oldPos = oldPos + 1;
        }
      }
    }

    // hideImage handles hiding the virtual object when the image target is lost
    const hideImage = () => {

//      object3D.visible = false

      // showhide(false, 'logo');
      // showhide(false, 'top_header');
      // showhide(false, 'bottom');

      // oldPos = 0;
    }

    const Rescan = () => {
      //alert("timeout");
      object3D.visible = false
      showhide(false, 'logo');
      showhide(false, 'top_header');
      showhide(false, 'bottom');

      oldPos = 0;
    }

    // These events are routed and dispatched by xrextras-generate-image-targets
    this.el.addEventListener('xrimagefound', showImage)
    this.el.addEventListener('xrimageupdated', showImage)
    this.el.addEventListener('xrimagelost', hideImage)

    showhide(false, 'logo');
    showhide(false, 'top_header');
    showhide(false, 'bottom');
    showhide(true, 'PopupImg');

    showhide(false, 'PreloaderImg');
    showhide(false, 'ChampionImg');
    showhide(false, 'loadImg');
    showhide(false, 'eighth');
    showhide(false, 'loadtext');

    showhide(false, 'SpeakerOn');
    showhide(true, 'SpeakerOff');
    sound1.mute(true);

    console.log("loaded");
  }
})

// xrextras-generate-image-targets uses this primitive to automatically populate multiple image targets
AFRAME.registerPrimitive('heineken-frame', {
  defaultComponents: {
    heinekenframe: {},
  },

  mappings: {
    name: 'heinekenframe.name',
    rotated: 'heinekenframe.rotated',
    metadata: 'heinekenframe.metadata',
  }
})

function playSound() {
    var sound = document.getElementById("audio");
    sound.play();
}

function showhide(flag, _id) {
  var logoImg = document.getElementById(_id);
  if(flag) {
    logoImg.style.display = "none";
  } else {
    logoImg.style.display = "block";
  }
}

function takeOnAudio() {
  showhide(false, 'SpeakerOff');
  showhide(true, 'SpeakerOn');
  sound1.mute(false);
  // alert("clicked photo image");
}

function takeOffAudio() {
  showhide(false, 'SpeakerOn');
  showhide(true, 'SpeakerOff');
  sound1.mute(true);
  // alert("clicked photo image");
}

function startTracking() {
  showhide(true, 'PreloaderImg');
  showhide(true, 'ChampionImg');
  showhide(true, 'loadImg');
  showhide(true, 'eighth');
  showhide(true, 'loadtext');

  isTracking = 1;

  // alert("clicked photo image");
}