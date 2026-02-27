// Copyright Epic Games, Inc. All Rights Reserved.

import { Logger } from '@epicgames-ps/lib-pixelstreamingcommon-ue5.7';
import { VideoPlayer } from './VideoPlayer';

/**
 * Video Player Controller handles the creation of the video HTML element and all handlers
 */
export class StreamController {
    videoElementProvider: VideoPlayer;

    /**
     * @param videoElementProvider Video Player instance
     */
    constructor(videoElementProvider: VideoPlayer) {
        this.videoElementProvider = videoElementProvider;
    }

    /**
     * Handles when the Peer connection has a track event
     * @param rtcTrackEvent - RTC Track Event
     */
    handleOnTrack(rtcTrackEvent: RTCTrackEvent) {
        Logger.Info('handleOnTrack ' + JSON.stringify(rtcTrackEvent.streams));
        // Do not add the track if the ID is `probator` as this is special track created by mediasoup for bitrate probing.
        // Refer to https://github.com/EpicGamesExt/PixelStreamingInfrastructure/pull/86 for more details.
        if (rtcTrackEvent.streams.length < 1 || rtcTrackEvent.streams[0].id == 'probator') {
            return;
        }

        const videoElement = this.videoElementProvider.getVideoElement();

        if (rtcTrackEvent.track) {
            Logger.Info(
                'Got track - ' +
                    rtcTrackEvent.track.kind +
                    ' id=' +
                    rtcTrackEvent.track.id +
                    ' readyState=' +
                    rtcTrackEvent.track.readyState
            );
        }

        if (rtcTrackEvent.track.kind == 'video' && videoElement.srcObject !== rtcTrackEvent.streams[0]) {
            videoElement.srcObject = rtcTrackEvent.streams[0];
            Logger.Info('Set video source from video track ontrack.');
            return;
        }
    }
}
