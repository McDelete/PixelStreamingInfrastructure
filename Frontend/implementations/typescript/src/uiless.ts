// Copyright Epic Games, Inc. All Rights Reserved.

import { Config, PixelStreaming, Logger } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.7';

document.body.onload = function() {
	const config = new Config({
		initialSettings: {
			AutoConnect: true,
			AutoPlayVideo: true,
			WaitForStreamer: true,
			StartVideoMuted: true,
			KeyboardInput: true,
			MouseInput: true,
			TouchInput: true,
			GamepadInput: true
		}
	});

	const stream = new PixelStreaming(config, { videoElementParent: document.getElementById('videoParentElement') });

	document.addEventListener('keydown', (event: KeyboardEvent) => {
		if (event.key !== 'z' && event.key !== 'Z') {
			return;
		}

		const activeStreamIndex = stream.nextVideoStream();
		Logger.Info(`Switched to next video stream index=${activeStreamIndex}`);
	});
};
