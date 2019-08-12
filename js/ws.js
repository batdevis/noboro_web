const ws = io('http://localhost:8002');

ws.on('midiInputList', function (data) {
  console.log('[ws] midiInputList', data);
  const midiInputs = document.getElementById("midi_inputs");

  while (midiInputs.hasChildNodes()) {
    midiInputs.removeChild(midiInputs.firstChild);
  }

  data.inputs.forEach(function(input) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = '#';
    a.innerText = input;
    a.setAttribute('data-device', input);
    a.addEventListener('click', activateMidiInput, false);
    li.appendChild(a);
    midiInputs.appendChild(li);
  });
  
  const midiInputActive = document.getElementById("midi_input_active");
  midiInputActive.innerText = data.active;
});

function activateMidiInput(e){
  const device = e.target.getAttribute('data-device');
  ws.emit('setMidiInput', {device: device});
}

ws.on('midiCc', function (data) {
  console.log('[ws] midiCc', data);

  const channelMap = {
    96: 0,//play/pause
    97: 1,
    98: 2,
    99: 3,
    100: 4
  };

  if (
    (data.channel == 0) &&
    (data.value == 127)
  ){
    if (data.controller == 0) {
      Tone.Transport.toggle();
    } else {
      var channelId = channelMap[data.controller];
      console.log(`toggle(${channelId})`);
      if(mixer.channels.indexOf(channelId) > -1) {
        mixer.channels[channelId].mute = !mixer.channels[channelId].mute;
      }
    }
  }
});
