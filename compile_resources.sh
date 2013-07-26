#!/bin/bash

targetFile=web-client/host/src/resource.js
resources=()

set -x

#images first
echo "Compiling Resources"
echo "  Collecting Files"
echo "window.bl = window.bl || {};" >> $targetFile
echo "window.bl.resources = {" >> $targetFile
findResults=($(find ./shared-resources ./tools -type f \( -iname "*.png" -o -iname "*.jpg" \) -not \( -iname "*@2x.*" \)))
last=$(( ${#findResults[@]} - 1 ))
resource_i=0
for i in  "${!findResults[@]}"
do
	f=${findResults[$i]};
	echo "        $f";

	b=$(basename $f);
	d=$(dirname $f);
	newFile=$d/tmp/$b;
	`mkdir -p $d/tmp/`;
	`cp $f $newFile`;
	echo "        $d/tmp/$b";

	# compress
	`optipng -o3 -preserve "$newFile"`;

	# encode
    k="data:image/png;base64,"`base64 -e "$newFile"`;
    k=`echo $k | tr -d '\n' | tr -d '\r'| tr -d ' '`
    w=`sips -g pixelWidth "$newFile" | tail -n1 | cut -d" " -f4`
    h=`sips -g pixelHeight "$newFile" | tail -n1 | cut -d" " -f4`


    # write the json

    # remove the starting .
    strippedPath=`echo "$f" | sed "s/\.\//\//g"`
    # clean up the filename
    fileNameClean=`echo "$strippedPath" | sed "s/\/shared\-resources\///g" | sed "s/\/images\///g" | sed "s/\/fonts\///g" | sed "s/\//\_/g" | sed "s/\-/\_/g" | awk '{print tolower($0)}'`
    #remove the extension
    varName=${fileNameClean%.*}
    #strip out un-useful bits
    varName=${varName##*tools_}
    varName=`echo $varName | sed "s/resources\_//"`

    finalPath="../..$strippedPath"

    suffix=","

    if [[ $i == $last ]]
    then
    	suffix=""
    fi


    # if this is not a directory
    if [[ $fileNameClean == *.* ]]
    then
    	echo "    \"$varName\": { " >> $targetFile
    	echo "	      \"src\": \"$k\"," >> $targetFile
    	echo "	      \"width\": $w," >> $targetFile
    	echo "	      \"height\": $h" >> $targetFile
    	echo "	  }$suffix" >> $targetFile
    	resource_i=$((resource_i+1))
    fi



    #cleanup
	`rm $newFile`
	
done
echo "};" >> $targetFile

echo "Resources Compiled!"
