import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ChannelModel} from "../../../models/channel.model";
import {RequestService} from "../../services/request.service";
import {environment} from "../../../environment/environment";

@Component({
  selector: 'app-channel',
  standalone: true,
    imports: [
        MatIcon,
        RouterLink
    ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit {
  channelId: string = '';
  channel!: ChannelModel;

  constructor(private activatedRoute: ActivatedRoute, private reqService: RequestService) {
    activatedRoute.params.subscribe(params => {
      this.channelId = params['id'];
    })
  }

  ngOnInit() {
    this.reqService.post<any>(environment.getChannelInfo + this.channelId, {})
      .subscribe((channelInfo) => {
        this.channel = channelInfo;
    })
  }
}
