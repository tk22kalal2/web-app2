export class LectureList {
  constructor() {
    this.currentLectures = [];
  }

  async loadLectures(platform, subject) {
    try {
      const response = await fetch(`/src/platforms/${platform}/subjects/${subject.toLowerCase()}.json`);
      const data = await response.json();
      this.currentLectures = data.lectures;
      return data.lectures;
    } catch (error) {
      console.error(`Error loading lectures:`, error);
      return [];
    }
  }

  openStreamingPage(streamingUrl) {
    // First attempt to open the window
    const streamingPage = window.open('about:blank', '_blank');
    
    // Check if window was successfully opened
    if (!streamingPage) {
      alert('Pop-up blocked! Please allow pop-ups for this site to view the lecture.\n\nTo allow pop-ups:\n1. Look for a pop-up blocked icon in your browser\'s address bar\n2. Click it and select "Always allow pop-ups from this site"\n3. Try watching the lecture again');
      return;
    }

    const downloadUrl = streamingUrl.replace('/watch/', '/dl/');

    // Write content only after confirming window is open
    streamingPage.document.open();
    streamingPage.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lecture Stream</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: system-ui, sans-serif; 
              background: #f0f4f8; 
            }
            .container { 
              max-width: 1200px; 
              margin: 0 auto; 
            }
            .video-container { 
              position: relative; 
              padding-bottom: 56.25%; 
              margin-bottom: 20px;
              background: #000;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            iframe { 
              position: absolute; 
              top: 0; 
              left: 0; 
              width: 100%; 
              height: 100%; 
              border: none; 
            }
            .download-btn { 
              display: inline-block;
              padding: 12px 24px;
              background: #2c5282;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 500;
              transition: background 0.3s;
              font-size: 16px;
            }
            .download-btn:hover { 
              background: #1a365d; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="video-container">
              <iframe src="${streamingUrl}" allowfullscreen></iframe>
            </div>
            <a href="${downloadUrl}" class="download-btn" download>
              Download Lecture
            </a>
          </div>
        </body>
      </html>
    `);
    streamingPage.document.close();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'lecture-list';

    if (this.currentLectures.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No lectures available';
      container.appendChild(message);
      return container;
    }

    this.currentLectures.forEach(lecture => {
      const lectureCard = document.createElement('div');
      lectureCard.className = 'lecture-card';
      
      const title = document.createElement('h3');
      title.textContent = lecture.title;
      
      const playButton = document.createElement('button');
      playButton.innerHTML = '<i class="fas fa-play"></i> Watch';
      playButton.onclick = () => this.openStreamingPage(lecture.streamingUrl);
      
      lectureCard.appendChild(title);
      lectureCard.appendChild(playButton);
      container.appendChild(lectureCard);
    });

    return container;
  }
}