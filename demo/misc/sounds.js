const soundSources = {
    // <soundName>: require(<soundFilePath>)
}

export default name => {
    const audioSrc     = soundSources[name];
    const audioElement = document.createElement('audio');

    audioElement.setAttribute('src', audioSrc);
    audioElement.play();
}
