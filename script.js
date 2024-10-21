function convertToAscii(text) {
        const asciiMap = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'C', 'Ğ': 'G', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
        };

        return text.split('').map(char => asciiMap[char] || char).join('');
    }
    
const canvas = document.getElementById('signature');
const canvasGuardian = document.getElementById('guardianSignature');
const ctx = canvas.getContext('2d');
const ctxGuardian = canvasGuardian.getContext('2d');
let drawing = false;
let drawingGuardian = false;

function resizeCanvas() {
    const savedData = canvas.toDataURL();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = 250 * ratio;
    canvas.height = 100 * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;

    const img = new Image();
    img.src = savedData;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvasGuardian(){
    const savedData = canvasGuardian.toDataURL();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasGuardian.width = 250 * ratio;
    canvasGuardian.height = 100 * ratio;
    ctxGuardian.scale(ratio, ratio);
    ctxGuardian.lineWidth = 2;

    const img = new Image();
    img.src = savedData;
    img.onload = function() {
        ctxGuardian.drawImage(img, 0, 0);
    };
    ctxGuardian.clearRect(0, 0, canvasGuardian.width, canvasGuardian.height);
}

function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function calculateAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
resizeCanvasGuardian();

function getTouchPos(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

function getMousePos(canvasDom, mouseEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const pos = getMousePos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvasGuardian.addEventListener('mousedown', (e) => {
    drawingGuardian = true;
    const pos = getMousePos(canvasGuardian, e);
    ctxGuardian.beginPath();
    ctxGuardian.moveTo(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        const pos = getMousePos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }
});

canvasGuardian.addEventListener('mousemove', (e) => {
    if (drawingGuardian) {
        const pos = getMousePos(canvasGuardian, e);
        ctxGuardian.lineTo(pos.x, pos.y);
        ctxGuardian.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvasGuardian.addEventListener('mouseup', () => {
    drawingGuardian = false;
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
});

canvasGuardian.addEventListener('mouseleave', () => {
    drawingGuardian = false;
});
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    drawing = true;
    const pos = getTouchPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvasGuardian.addEventListener('touchstart', (e) => {
    e.preventDefault();
    drawingGuardian = true;
    const pos = getTouchPos(canvasGuardian, e);
    ctxGuardian.beginPath();
    ctxGuardian.moveTo(pos.x, pos.y);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (drawing) {
        const pos = getTouchPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }
});

canvasGuardian.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (drawingGuardian) {
        const pos = getTouchPos(canvasGuardian, e);
        ctxGuardian.lineTo(pos.x, pos.y);
        ctxGuardian.stroke();
    }
});
canvas.addEventListener('touchend', () => {
    drawing = false;
});

canvasGuardian.addEventListener('touchend', () => {
    drawingGuardian = false;
});
document.getElementById('birthDate').addEventListener('change', function() {
    const birthDate = document.getElementById('birthDate').value;
    const age = calculateAge(birthDate);

    const guardianFields = document.getElementById('guardianFields');
    
    if (age < 18) {
        guardianFields.style.display = 'block';
        document.getElementById('guardianName').required = true;
        document.getElementById('guardianTc').required = true;
    } else {
        guardianFields.style.display = 'none';
        document.getElementById('guardianName').required = false; 
        document.getElementById('guardianTc').required = false;   
    }
});
document.getElementById('clearSignature').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('clearGuardianSignature').addEventListener('click', () => {
    ctxGuardian.clearRect(0, 0, canvasGuardian.width, canvasGuardian.height);
});

document.getElementById("currentDate").innerText = new Date().toLocaleDateString();

document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const tc = convertToAscii(document.getElementById('tc').value);
    const name = convertToAscii(document.getElementById('name').value);
    const fatherName = convertToAscii(document.getElementById('fatherName').value);
    const motherName = convertToAscii(document.getElementById('motherName').value);
    const birthDate = convertToAscii(document.getElementById('birthDate').value);
    const formattedBirthDate = formatDateToDDMMYYYY(birthDate);
    const age = calculateAge(birthDate);
    const birthPlace = convertToAscii(document.getElementById('birthPlace').value);
    const bloodType = convertToAscii(document.getElementById('bloodType').value);
    const email = convertToAscii(document.getElementById('email').value);
    const phone = convertToAscii(document.getElementById('phone').value);
    const job = convertToAscii(document.getElementById('job').value);
    const homeAddress = convertToAscii(document.getElementById('homeAddress').value);
    const workAddress = convertToAscii(document.getElementById('workAddress').value);
    const signatureDataUrl = canvas.toDataURL('image/png');

    const existingPdfBytes = await fetch("Urfadosk_2024_Lisans_Tescil_Fisi.pdf").then(res => res.arrayBuffer());

    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).padStart(2, '0').slice(-1);

    if (age < 18) {
        const guardianName = convertToAscii(document.getElementById('guardianName').value);
        const guardianTc = convertToAscii(document.getElementById('guardianTc').value);

        
        firstPage.drawText(guardianTc, { x: 150, y: 355, size: 10 });
        firstPage.drawText(guardianName, { x: 150, y: 340, size: 10 });

        
        const guardianSignatureDataUrl = canvasGuardian.toDataURL('image/png');
        const signatureGuardianImage = await pdfDoc.embedPng(guardianSignatureDataUrl);
        const signatureGuardianDims = signatureGuardianImage.scale(0.2);
        firstPage.drawImage(signatureGuardianImage, {
            x: 100,
            y: 290,
            width: signatureGuardianDims.width,
            height: signatureGuardianDims.height,
        });
    }
    firstPage.drawText(name, { x: 215, y: 623, size: 10 });
    firstPage.drawText(tc, { x: 215, y: 609, size: 10 });
    firstPage.drawText(motherName+ " - ", { x: 215, y: 594, size: 10 });
    firstPage.drawText(fatherName, { x: 267, y: 594, size: 10 });
    firstPage.drawText(birthPlace+ " - ", { x: 215, y: 580, size: 10 });
    firstPage.drawText(formattedBirthDate, { x: 265, y: 580, size: 10 });
    firstPage.drawText(bloodType, { x: 215, y: 565, size: 10 });
    firstPage.drawText(email, { x: 215, y: 551, size: 10 });
    firstPage.drawText(phone, { x: 215, y: 537, size: 10 });
    firstPage.drawText(job, { x: 215, y: 521, size: 10 });
    firstPage.drawText(workAddress, { x: 215, y: 506, size: 10 });
    firstPage.drawText(homeAddress, { x: 215, y: 490, size: 10 });
    firstPage.drawText(day, { x: 120, y: 218, size: 10 });
    firstPage.drawText(month, { x: 148, y: 218, size: 10 });
    firstPage.drawText(year, { x: 188, y: 216, size: 11});

    const signatureImage = await pdfDoc.embedPng(signatureDataUrl);
    const signatureDims = signatureImage.scale(0.2);
    firstPage.drawImage(signatureImage, {
        x: 100,
        y: 90,
        width: signatureDims.width,
        height: signatureDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    let newWindow = null;

    
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMiBrowser = /MiuiBrowser/i.test(navigator.userAgent);

    if (isSafari || isMiBrowser) {
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.pdf'; 
        link.click();
        alert('Tarayıcıda PDF açma desteği kısıtlı. Dosya indiriliyor.');
    } else {
        
        newWindow = window.open(url, '_blank');
        if (newWindow === null) {
            alert("Pop-up engellendi. Lütfen tarayıcı ayarlarından pop-up izni verin.");
        } else {
            newWindow.focus();
        }
    }

});