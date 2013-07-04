#!/bin/bash

targetFile=res.js
echo "" > $targetFile
resources=()

#images first
echo "Compiling Resources"
echo "  Collecting Files"
echo "window.bl = window.bl || {};" >> $targetFile
echo "window.bl.resources = {" >> $targetFile
findResults=($(find ./shared-resources -not \( -iname "*@2x.png" -o -iname "*.js" \)))
last=$(( ${#findResults[@]} - 1 ))
resource_i=0
for i in  "${!findResults[@]}"
do
	f=${findResults[$i]}
	echo "        $f"
	# remove the starting .
	strippedPath=`echo "$f" | sed "s/\.\//\//g"`
	# clean up the filename
	fileNameClean=`echo "$strippedPath" | sed "s/\/shared\-resources\///g" | sed "s/\/images\///g" | sed "s/\/fonts\///g" | sed "s/\//\_/g" | sed "s/\-/\_/g" | awk '{print tolower($0)}'`
	#remove the extension
	varName=${fileNameClean%.*}
	finalPath="../..$strippedPath"

	suffix=","

	if [[ $i == $last ]]
	then
		suffix=""
	fi

	# if this is not a directory
	if [[ $fileNameClean == *.* ]]
	then
		echo "    \"$varName\": \"$finalPath\"$suffix" >> $targetFile
		resources[$resource_i]="window.bl.resources['$varName']"
		resource_i=$((resource_i+1))
	else
		# append a trailing slash
		echo "    \"$varName\": \"$finalPath/\"$suffix" >> $targetFile
	fi
done
echo "};" >> $targetFile

echo "  Writing Resources"
echo "// Cocos Preloaded Resources" >> $targetFile
echo "var g_resources = [" >> $targetFile

# get the last index of the array
last=$(( ${#resources[*]} - 1 ))
for i in "${!resources[@]}"
do

	suffix=","

	if [[ $i == $last ]]
	then
		suffix=""
	fi

	echo "    {src:${resources[$i]}}$suffix" >> $targetFile

done
echo "];" >> $targetFile

echo "Resources Compiled!"
