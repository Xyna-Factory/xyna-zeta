/*
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Copyright 2023 Xyna GmbH, Germany
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { ApiService, RuntimeContext, StartOrderOptionsBuilder, Xo, XoArray, XoArrayClass, XoObject, XoObjectClass, XoObjectClassInterface, XoProperty } from '../../api';
import { pack, seconds } from '../../base';
import { XcGraphData, XcGraphDataRequestOptions, XcGraphDataSource, XcGraphSlice, XcGraphType, XcTimeInterval } from './xc-graph-data-source';


// @ts-expect-error(TODO:)
@XoObjectClass(null, 'xmcp.graphs.datatypes', 'TimeInterval')
export class XoTimeInterval extends XoObject {

    @XoProperty()
    // @ts-expect-error(TODO:)
    timeAt: number;

    @XoProperty()
    // @ts-expect-error(TODO:)
    timeTo: number;

    get asXcTimeInterval(): XcTimeInterval {
        return {
            timeAt: this.timeAt,
            timeTo: this.timeTo
        };
    }
}


@XoArrayClass(XoTimeInterval)
export class XoTimeIntervalArray extends XoArray<XoTimeInterval> {
}


// @ts-expect-error(TODO:)
@XoObjectClass(null, 'xmcp.graphs.datatypes', 'GraphInfo')
export class XoGraphInfo extends XoObject {

    @XoProperty()
    // @ts-expect-error(TODO:)
    bootstrap: boolean;

    @XoProperty()
    // @ts-expect-error(TODO:)
    version: string;

    @XoProperty()
    // @ts-expect-error(TODO:)
    label: string;

    @XoProperty()
    // @ts-expect-error(TODO:)
    xAxisName: string;

    @XoProperty()
    // @ts-expect-error(TODO:)
    yAxisName: string;

    @XoProperty()
    // @ts-expect-error(TODO:)
    xAxisUnit: string;

    @XoProperty()
    // @ts-expect-error(TODO:)
    yAxisUnit: string;

    @XoProperty()
    // @ts-expect-error(TODO:)
    minValue: number;

    @XoProperty()
    // @ts-expect-error(TODO:)
    maxValue: number;

    @XoProperty()
    // @ts-expect-error(TODO:)
    resolution: number;

    @XoProperty(XoTimeIntervalArray)
    // @ts-expect-error(TODO:)
    intervals: XoTimeIntervalArray;
}


// @ts-expect-error(TODO:)
@XoObjectClass(null, 'xmcp.graphs.datatypes', 'GraphSlice')
export class XoGraphSlice extends XoObject {

    @XoProperty()
    // @ts-expect-error(TODO:)
    time: number;

    @XoProperty()
    // @ts-expect-error(TODO:)
    values: number[];

    get asXcGraphSlice(): XcGraphSlice {
        return {
            time: this.time,
            values: this.values
        };
    }
}


@XoArrayClass(XoGraphSlice)
export class XoGraphSliceArray extends XoArray<XoGraphSlice> {
}


// @ts-expect-error(TODO:)
@XoObjectClass(null, 'xmcp.graphs.datatypes', 'GraphData')
export class XoGraphData extends XoObject {

    @XoProperty()
    // @ts-expect-error(TODO:)
    id: number;

    @XoProperty()
    // @ts-expect-error(TODO:)
    type: XcGraphType;

    @XoProperty(XoGraphSliceArray)
    // @ts-expect-error(TODO:)
    slices: XoGraphSliceArray;

    get asXcGraphData(): XcGraphData {
        return {
            id: this.id,
            type: this.type,
            slices: this.slices.data.map(value => value.asXcGraphSlice),
            voids: []
        };
    }
}


@XoArrayClass(XoGraphData)
export class XoGraphDataArray extends XoArray<XoGraphData> {
}


export class XcRemoteGraphDataSource extends XcGraphDataSource {

    /** Timeout for the server response to arrive before retry */
    static readonly REQUEST_RETRY_TIMEOUT = seconds(3);

    /** Offset to server time (allows server to be delayed in processing real time data) */
    static readonly SERVER_TIME_OFFSET = seconds(3);

    /** Graph info version */
    static readonly version = '1.0';

    /** Start time of currently running request */
    // @ts-expect-error(TODO:)
    protected requestTime: number;

    /** Start time of last erroneous request */
    // @ts-expect-error(TODO:)
    protected errorTime: number;

    /** Last responded graph info */
    protected graphInfo?: XoGraphInfo;

    /** Additional inputs besides the graph info */
    input?: Xo | Xo[];


    constructor(
        protected readonly apiService: ApiService,
        public rtc: RuntimeContext,
        public orderType: string,
        public graphInfoClass: XoObjectClassInterface<XoGraphInfo> = XoGraphInfo
    ) {
        super();
        this.timeOffset = XcRemoteGraphDataSource.SERVER_TIME_OFFSET;
    }


    protected request(options: XcGraphDataRequestOptions) {
        // request running or not enough time has passed since last erroneous request?
        if (this.requestTime || (this.errorTime && +new Date() - this.errorTime < XcRemoteGraphDataSource.REQUEST_RETRY_TIMEOUT)) {
            return;
        }
        // create graph info instance
        let graphInfoInstance: XoGraphInfo;
        if (this.graphInfo) {
            // use available graph info
            graphInfoInstance = this.graphInfo;
            graphInfoInstance.intervals.data.splice(0);
        } else {
            // create graph info for bootstrapping graph
            graphInfoInstance = new this.graphInfoClass();
            graphInfoInstance.version = XcRemoteGraphDataSource.version;
            graphInfoInstance.bootstrap = true;
            graphInfoInstance.intervals = new XoTimeIntervalArray();
        }
        // @ts-expect-error(TODO:)
        graphInfoInstance.intervals.data.splice(0, 0, ...options.intervals.map(value => new XoTimeInterval().decode(value as any)));
        // @ts-expect-error(TODO:)
        graphInfoInstance.resolution = options.resolution;
        // create input and output of startorder
        const input  = [graphInfoInstance, ...pack(this.input)];
        const output = [this.graphInfoClass, XoGraphDataArray];
        // set pending flag and execute startorder
        this.requestTime = +new Date();
        // @ts-expect-error(TODO:)
        this.apiService.startOrder(this.rtc, this.orderType, input, output, new StartOrderOptionsBuilder().withErrorMessage(true).options).pipe(
            catchError(error => {
                this.errorTime = this.requestTime;
                return throwError(error);
            }),
            // @ts-expect-error(TODO:)
            finalize(() => this.requestTime = undefined)
        ).subscribe(result => {
            if (result.errorMessage) {
                this.errorTime = this.requestTime;
            } else {
                // @ts-expect-error(TODO:)
                this.errorTime = undefined;
                // @ts-expect-error(TODO:)
                this.graphInfo = result.output[0] as XoGraphInfo;
                // @ts-expect-error(TODO:)
                const graphDataArray = result.output[1] as XoGraphDataArray;
                this.mergeGraphData(graphDataArray.data.map(value => value.asXcGraphData), options);
            }
        });
    }
}
