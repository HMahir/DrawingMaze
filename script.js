let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let brush = document.getElementById("brush");
    let erase = document.getElementById("erase");
    let artist = document.getElementById("artist");
    let speed = 5;
    let drawing = false;
    let index = 0;
    let maze1 = {
      xValues: [377, 377, 403, 403, 351, 351, 326, 326, 300, 300, 351, 351, 377, 377, 351,
        351, 377, 377, 403, 403, 429, 429, 454, 454, 429, 429, 403, 403, 377, 377,
        326, 326, 274, 274, 326, 326, 300, 300, 326, 326, 300, 300, 274, 274, 377,
        377, 351, 351, 326, 326, 300, 300, 274, 274, 248, 248, 222, 222, 197, 197,
        222, 222, 248, 248, 300, 300, 326, 326, 403, 403],

      yValues: [3, 16, 16, 42, 42, 16, 16, 42, 42, 68, 68, 119, 119, 145, 145, 171,
        171, 197, 197, 171, 171, 197, 197, 326, 326, 300, 300, 274, 274, 403,
        403, 377, 377, 429, 429, 454, 454, 480, 480, 506, 506, 532, 532, 558, 558,
        661, 661, 712, 712, 687, 687, 661, 661, 635, 635, 687, 687, 712, 712, 738,
        738, 764, 764, 712, 712, 738, 738, 764, 764, 777, 777]
    };
    let maze2 = {
      xValues: [380, 380, 406, 406, 380, 380, 406, 406, 432, 432, 380, 380, 328, 328, 380, 380,
        406, 406, 432, 432, 380, 380, 354, 354, 328, 328, 302, 302, 250, 250, 276, 276, 250, 250,
        302, 302, 380, 380, 406, 406, 380, 380, 406, 406],

      yValues: [3, 68, 68, 94, 94, 146, 146, 120, 120, 172, 172, 250, 250, 302, 302, 328,
        328, 406, 406, 458, 458, 510, 510, 458, 458, 562, 562, 536, 536, 562, 562, 588, 588, 640, 640,
        614, 614, 640, 640, 716, 716, 744, 744, 782, 782]
    };

    const ORIGINAL_SIZE = 484;  
      const NEW_SIZE = 780;        

      function scaleValues(values) {
        return values.map(val => Math.round(val * (NEW_SIZE / ORIGINAL_SIZE)));
      }

      function scaleMaze(maze) {
        return {
          xValues: scaleValues(maze.xValues),
          yValues: scaleValues(maze.yValues),
        };
      }
    let maze3 = scaleMaze({
        xValues: [234, 234, 202, 202, 218, 218, 234, 234, 250, 250, 218, 218, 202, 202, 170, 170, 
          154, 154, 138, 138, 122, 122, 138, 138, 122, 122, 90, 90, 58, 58, 74, 74, 42, 42, 26, 26, 
          10, 10, 26, 26, 10, 10, 26, 26, 74, 74, 90, 90, 42, 42, 74, 74, 58, 58, 26, 26, 10, 10, 
          26, 26, 42, 42, 58, 58, 74, 74, 90, 90, 106, 106, 90, 90, 58, 58, 42, 42, 74, 74, 90, 90, 
          122, 122, 138, 138, 154, 154, 138, 138, 170, 170, 202, 202, 234, 234, 250, 250, 298, 298, 
          314, 314, 298, 298, 314, 314, 298, 298, 314, 314, 346, 346, 394, 394, 362, 362, 314, 314, 
          330, 330, 346, 346, 330, 330, 298, 298, 282, 282, 298, 298, 250, 250],
        
      yValues: [2, 10, 10, 26, 26, 42, 42, 58, 58, 74, 74, 58, 58, 74, 74, 90, 
          90, 154, 154, 138, 138, 122, 122, 74, 74, 58, 58, 90, 90, 74, 74, 58, 58, 42, 42, 58, 58, 
          154, 154, 186, 186, 250, 250, 218, 218, 202, 202, 234, 234, 250, 250, 282, 282, 330, 330, 
          346, 346, 394, 394, 410, 410, 394, 394, 426, 426, 442, 442, 394, 394, 346, 346, 362, 362, 
          378, 378, 346, 346, 330, 330, 314, 314, 362, 362, 314, 314, 298, 298, 282, 282, 314, 314, 
          330, 330, 314, 314, 282, 282, 234, 234, 298, 298, 314, 314, 346, 346, 378, 378, 362, 362, 
          394, 394, 474, 474, 458, 458, 426, 426, 442, 442, 410, 410, 394, 394, 410, 410, 442, 442, 
          474, 474, 482, 482]
      });

    let currentMaze = maze1;
    // Disable all buttons on page load
window.addEventListener("load", () => {
  disableButtons();  // Disable buttons initially when the page loads
});


    function disableButtons() {
      document.querySelectorAll("#startBtn, #eraseBtn").forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.5";
      });
    }

    function enableButtons() {
      document.querySelectorAll("#startBtn, #eraseBtn").forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = "1";
      });
    }
    function animatePath(eraseMode = false) {
    if (!drawing || index >= currentMaze.xValues.length - 1) {
        drawing = false;
        brush.style.display = "none";
        erase.style.display = "none";

        // Enable/disable buttons depending on mode
        if (eraseMode) {
            document.getElementById("eraseBtn").disabled = true;
            document.getElementById("eraseBtn").style.opacity = "0.5";
            document.getElementById("startBtn").disabled = false;
            document.getElementById("startBtn").style.opacity = "1";
        } else {
            document.getElementById("eraseBtn").disabled = false;
            document.getElementById("eraseBtn").style.opacity = "1";
            document.getElementById("startBtn").disabled = true;
            document.getElementById("startBtn").style.opacity = "0.5";
        }

        return;
    }

    let x1 = currentMaze.xValues[index];
    let y1 = currentMaze.yValues[index];
    let x2 = currentMaze.xValues[index + 1];
    let y2 = currentMaze.yValues[index + 1];

    let dx = x2 - x1;
    let dy = y2 - y1;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let steps = Math.ceil(distance * 2);
    let stepX = dx / steps;
    let stepY = dy / steps;

    let i = 0;
    let tool = eraseMode ? erase : brush;
    tool.style.display = "block";

    if (eraseMode) {
        ctx.globalCompositeOperation = "destination-out"; // Set to erase mode
    } else {
        ctx.globalCompositeOperation = "source-over"; // Reset to drawing mode
    }

    function stepAnimation() {
        if (!drawing) return;

        if (i <= steps) {
            let nextX = x1 + stepX * i;
            let nextY = y1 + stepY * i;

            tool.style.left = `${canvas.offsetLeft + nextX}px`;
            tool.style.top = `${canvas.offsetTop + nextY}px`;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(nextX, nextY);
            ctx.strokeStyle = eraseMode ? "white" : document.getElementById("izbira").value;
            ctx.lineWidth = 2;
            ctx.stroke();

            i++;
            setTimeout(stepAnimation, speed);
        } else {
            index++;
            requestAnimationFrame(() => animatePath(eraseMode));
        }
    }

    stepAnimation();
}

    function animateArtist() {
  artist.style.display = "block";
  let i = 0;
  
  function moveArtist() {
    // Stop animation when all points are traversed
    if (i >= currentMaze.xValues.length) {
      artist.style.display = "none";
      enableButtons();
      document.getElementById("getInspirationBtn").disabled = true;
      document.getElementById("getInspirationBtn").style.opacity = "0.5";
      document.getElementById("eraseBtn").disabled=true;
      document.getElementById("eraseBtn").style.opacity="0.5";
      return;
    }

    // Current and next coordinates
    let x1 = currentMaze.xValues[i];
    let y1 = currentMaze.yValues[i];
    let x2 = currentMaze.xValues[i + 1];
    let y2 = currentMaze.yValues[i + 1];

    // Calculate distance and steps to smooth movement
    let dx = x2 - x1;
    let dy = y2 - y1;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let steps = Math.ceil(distance * 2); // Increase the multiplier for smoother animation
    let stepX = dx / steps;
    let stepY = dy / steps;

    let j = 0; // Counter for each step between two points

    function moveStep() {
      if (j <= steps) {
        let nextX = x1 + stepX * j;
        let nextY = y1 + stepY * j;

        // Move the artist's position on the canvas
        artist.style.left = `${canvas.offsetLeft + nextX - artist.width / 2}px`; // Adjust artist position
        artist.style.top = `${canvas.offsetTop + nextY - artist.height / 2}px`; // Adjust artist position

        j++;
        setTimeout(moveStep,speed); // Delay between each movement
      } else {
        // Once the current segment is completed, move to the next
        i++;
        moveArtist(); // Recursively call to move to the next segment
      }
    }

    moveStep(); // Start moving between two points
  }

  moveArtist();
}

document.getElementById("getInspirationBtn").addEventListener("click", function () {
      document.getElementById("getInspirationBtn").disabled = true;
      document.getElementById("getInspirationBtn").style.opacity = "0.5";
      animateArtist();
    });
    document.getElementById("startBtn").addEventListener("click", function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      index = 0;
      drawing = true;
      disableButtons();
      animatePath(false);
    });

    document.getElementById("eraseBtn").addEventListener("click", function () {
      if (drawing) return;
      index = 0;
      drawing = true;
      disableButtons();
      animatePath(true);
    });

    document.getElementById("speedRange").addEventListener("input", function () {
      speed = 21 - this.value;
      let speedLabel = speed >= 15 ? "Slow" : speed >= 7 ? "Normal" : "Fast";
      document.getElementById("speedValue").textContent = speedLabel;
    });

    // Function to set active button state
function setActiveButton(selectedButtonId) {
    // Remove hover effect from all difficulty buttons
    document.querySelectorAll("#easyBtn, #mediumBtn, #hardBtn").forEach(btn => {
        btn.classList.remove("active");
    });

    // Add hover effect to the selected button
    document.getElementById(selectedButtonId).classList.add("active");
}

// Set Medium as default selected on page load
window.addEventListener("load", () => {
    setActiveButton("mediumBtn");
});

document.getElementById("easyBtn").addEventListener("click", function () {
    if (drawing) return;
    document.getElementById("slika").src = "images/easy2.svg";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentMaze = maze2;
    document.getElementById("getInspirationBtn").disabled = false;
    document.getElementById("getInspirationBtn").style.opacity = "1";
    disableButtons();
    setActiveButton("easyBtn"); // Set Easy as active
});

document.getElementById("mediumBtn").addEventListener("click", function () {
    if (drawing) return;
    document.getElementById("slika").src = "images/medium.svg";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentMaze = maze1;
    document.getElementById("getInspirationBtn").disabled = false;
    document.getElementById("getInspirationBtn").style.opacity = "1";
    disableButtons();
    setActiveButton("mediumBtn"); // Set Medium as active
});

document.getElementById("hardBtn").addEventListener("click", function () {
    if (drawing) return;
    document.getElementById("slika").src = "images/maze2.svg";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentMaze = maze3;
    document.getElementById("getInspirationBtn").disabled = false;
    document.getElementById("getInspirationBtn").style.opacity = "1";
    disableButtons();
    setActiveButton("hardBtn"); // Set Hard as active
});


  </script>
     <script>
        document.getElementById("slikar").addEventListener("click", function() {
            Swal.fire({
                icon: 'info',
                title: 'Dijak: Mahir Hodžić, 4.Ra',
                text: 'Profesor: Boštjan Vouk',
                 confirmButtonText: 'V redu',
                confirmButtonColor: '#CBC3E3'
            });
        });
